import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const defaultHtmlCode = `<div class="h-screen flex justify-center items-center">
  <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 mx-auto">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 text-center mb-4">Execute</h2>

    <p class="text-gray-600 text-center leading-relaxed">
      A quick way to test some HTML/CSS/JS code without scaffolding a new project locally.
    </p>

    <div class="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6"></div>
  </div>
</div>
`;

export const create = mutation({
  args: { type: v.optional(v.union(v.literal("classic"), v.literal("sandpack"))) },
  async handler(ctx, args) {
    const type = args.type || "classic";
    const projectData =
      type === "sandpack"
        ? {
            html: "",
            css: "",
            js: "",
            type: "sandpack" as const,
            files: {
              "/App.js": {
                code: `export default function App() {
  return <h1>Hello world</h1>
}`,
              },
              "/index.js": {
                code: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
              },
              "/public/index.html": {
                code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
              },
            },
          }
        : { html: defaultHtmlCode, css: "", js: "", type: "classic" as const };

    const projectId = await ctx.db.insert("projects", projectData);
    return projectId;
  },
});

export const get = query({
  args: { id: v.id("projects") },
  async handler(ctx, args) {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    html: v.optional(v.string()),
    css: v.optional(v.string()),
    js: v.optional(v.string()),
    files: v.optional(v.record(v.string(), v.object({ code: v.string() }))),
  },
  async handler(ctx, args) {
    return await ctx.db.patch(args.id, {
      ...(args.html !== undefined ? { html: args.html } : {}),
      ...(args.css !== undefined ? { css: args.css } : {}),
      ...(args.js !== undefined ? { js: args.js } : {}),
      ...(args.files !== undefined ? { files: args.files } : {}),
    });
  },
});
