import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getDb } from "../db";
import { beans, profiles } from "../../../db/schema";
import { eq, and, desc } from "drizzle-orm";
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

  const allBeans = await db.query.beans.findMany({
    where: eq(beans.householdId, householdId),
    orderBy: [desc(beans.createdAt)],
  });

  return c.json(allBeans);
});

const createBeanSchema = z.object({
  name: z.string().min(1),
  origin: z.string().optional().nullable(),
  roastLevel: z.number().int().min(1).max(5).optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

app.post("/", zValidator("json", createBeanSchema), async (c) => {
  const householdId = await getHouseholdId(c);
  const data = c.req.valid("json");
  const db = getDb(c.env.DATABASE_URL);

  const [newBean] = await db
    .insert(beans)
    .values({
      ...data,
      householdId,
    })
    .returning();

  return c.json(newBean);
});

const updateBeanSchema = z.object({
  name: z.string().min(1).optional(),
  origin: z.string().optional().nullable(),
  roastLevel: z.number().int().min(1).max(5).optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isArchived: z.boolean().optional(),
});

app.patch("/:id", zValidator("json", updateBeanSchema), async (c) => {
  const householdId = await getHouseholdId(c);
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const db = getDb(c.env.DATABASE_URL);

  const [updatedBean] = await db
    .update(beans)
    .set(data)
    .where(and(eq(beans.id, id), eq(beans.householdId, householdId)))
    .returning();

  if (!updatedBean) {
    throw new HTTPException(404, { message: "Bean not found or unauthorized" });
  }

  return c.json(updatedBean);
});

export default app;
