import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getDb } from "../db";
import { brewLogs, profiles } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

type Bindings = {
  DATABASE_URL: string;
};

type Variables = {
  lineUserId: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Helper to get householdId
async function getHouseholdId(c: any) {
  const lineUserId = c.get("lineUserId");
  const db = getDb(c.env.DATABASE_URL);
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.lineUserId, lineUserId),
  });
  if (!profile) {
    throw new HTTPException(401, { message: "Profile not initialized" });
  }
  return profile.householdId;
}

app.get("/", async (c) => {
  const householdId = await getHouseholdId(c);
  const db = getDb(c.env.DATABASE_URL);

  const allLogs = await db.query.brewLogs.findMany({
    where: eq(brewLogs.householdId, householdId),
    with: {
      bean: true,
      user: true,
    },
    orderBy: [desc(brewLogs.createdAt)],
  });

  return c.json(allLogs);
});

const createLogSchema = z.object({
  beanId: z.string().uuid(),
  method: z.string().optional().nullable(),
  grindSize: z.string().optional().nullable(),
  waterTemp: z.number().int().optional().nullable(),
  beanAmount: z.number().optional().nullable(),
  waterAmount: z.number().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  note: z.string().optional().nullable(),
});

app.post("/", zValidator("json", createLogSchema), async (c) => {
  const lineUserId = c.get("lineUserId");
  const householdId = await getHouseholdId(c);
  const data = c.req.valid("json");
  const db = getDb(c.env.DATABASE_URL);

  const [newLog] = await db
    .insert(brewLogs)
    .values({
      ...data,
      userId: lineUserId,
      householdId,
    })
    .returning();

  return c.json(newLog);
});

export default app;
