import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    html: v.string(),
    css: v.string(),
    js: v.string(),
    files: v.optional(v.record(v.string(), v.object({ code: v.string() }))),
    type: v.optional(v.union(v.literal("classic"), v.literal("sandpack"))),
  }),
});
