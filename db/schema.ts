import { pgTable, text, uuid, timestamp, integer, boolean, date, real } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const households = pgTable("households", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const householdsRelations = relations(households, ({ many }) => ({
  profiles: many(profiles),
  beans: many(beans),
  brewLogs: many(brewLogs),
}));

export const profiles = pgTable("profiles", {
  lineUserId: text("line_user_id").primaryKey(),
  householdId: uuid("household_id")
    .notNull()
    .references(() => households.id),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  household: one(households, {
    fields: [profiles.householdId],
    references: [households.id],
  }),
  brewLogs: many(brewLogs),
}));

export const beans = pgTable("beans", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  householdId: uuid("household_id")
    .notNull()
    .references(() => households.id),
  name: text("name").notNull(),
  origin: text("origin"),
  roastLevel: integer("roast_level"), // 1:浅煎り 〜 5:深煎り 等
  purchaseDate: date("purchase_date"),
  imageUrl: text("image_url"),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const beansRelations = relations(beans, ({ one, many }) => ({
  household: one(households, {
    fields: [beans.householdId],
    references: [households.id],
  }),
  brewLogs: many(brewLogs),
}));

export const brewLogs = pgTable("brew_logs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  beanId: uuid("bean_id")
    .notNull()
    .references(() => beans.id),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.lineUserId),
  householdId: uuid("household_id")
    .notNull()
    .references(() => households.id),
  method: text("method"),
  grindSize: text("grind_size"),
  waterTemp: integer("water_temp"),
  beanAmount: real("bean_amount"),
  waterAmount: real("water_amount"),
  rating: integer("rating"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const brewLogsRelations = relations(brewLogs, ({ one }) => ({
  bean: one(beans, {
    fields: [brewLogs.beanId],
    references: [beans.id],
  }),
  user: one(profiles, {
    fields: [brewLogs.userId],
    references: [profiles.lineUserId],
  }),
  household: one(households, {
    fields: [brewLogs.householdId],
    references: [households.id],
  }),
}));
