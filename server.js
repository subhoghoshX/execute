const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.get("/test", (req, res) => {
    res.send("<h1>Hello World! - Test</h1>");
  });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(3000, () => {
    console.log("App is runing on port 3000");
  });
});
