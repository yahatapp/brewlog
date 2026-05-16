import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getDb } from "../db";
import { households, profiles } from "../../../db/schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DATABASE_URL: string;
};

type Variables = {
  lineUserId: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const initSchema = z.object({
  displayName: z.string(),
  avatarUrl: z.string().optional().nullable(),
});

app.post("/init", zValidator("json", initSchema), async (c) => {
  const lineUserId = c.get("lineUserId");
  const { displayName, avatarUrl } = c.req.valid("json");
  const db = getDb(c.env.DATABASE_URL);

  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.lineUserId, lineUserId),
    with: {
      household: true,
    },
  });

  if (existingProfile) {
    return c.json({
      profile: {
        lineUserId: existingProfile.lineUserId,
        householdId: existingProfile.householdId,
        displayName: existingProfile.displayName,
        avatarUrl: existingProfile.avatarUrl,
        createdAt: existingProfile.createdAt,
      },
      household: existingProfile.household,
    });
  }

  // Create new household and profile
  const result = await db.transaction(async (tx) => {
    const [newHousehold] = await tx
      .insert(households)
      .values({
        name: `${displayName}'s Household`,
      })
      .returning();

    const [newProfile] = await tx
      .insert(profiles)
      .values({
        lineUserId,
        householdId: newHousehold.id,
        displayName,
        avatarUrl,
      })
      .returning();

    return {
      profile: newProfile,
      household: newHousehold,
    };
  });

  return c.json(result);
});

export default app;
