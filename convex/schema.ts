import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    html: v.string(),
    css: v.string(),
    js: v.string(),
  }),
});
