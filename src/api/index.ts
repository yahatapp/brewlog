import { Hono } from "hono";
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { authMiddleware } from "./middleware/auth";
import auth from "./routes/auth";
import beans from "./routes/beans";
import logs from "./routes/logs";

type Bindings = {
  DATABASE_URL: string;
  LINE_CHANNEL_ID: string;
  ALLOWED_LINE_USER_IDS: string;
};

type Variables = {
  lineUserId: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath("/api");

// Apply authentication middleware to all routes
app.use("/*", authMiddleware);

// Mount routes
app.route("/auth", auth);
app.route("/beans", beans);
app.route("/logs", logs);

app.get("/db-check", async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    // Simple query to check connection
    const result = await db.execute(sql`SELECT 1`);
    return c.json({
      status: "ok",
      message: "Database connection successful",
      result,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export default app;
export type AppType = typeof app;
