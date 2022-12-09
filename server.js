const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");
const { ChangeSet, Text } = require("@codemirror/state");
const { Update } = require("@codemirror/collab");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });

const handle = nextApp.getRequestHandler();

// The updates received so far (updates.length gives the current version)
const updates = [];
// The current document
let doc = Text.of(["Start document"]);
// Authority message
const pending = [];

nextApp.prepare().then(() => {
  const app = express();

  //
  const server = http.createServer(app);
  const io = new Server(server);

  app.get("/test", (req, res) => {
    res.send("<h1>Hello World! - Test</h1>");
  });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("user disconnected!");
    });
    console.log("one user connected");
    // pull updates
    socket.on("pullUpdates", (version) => {
      if (version < updates.length) {
        socket.emit(
          "pullUpdateResponse",
          JSON.stringify(updates.slice(version)),
        );
      } else {
        pending.push((updates) => {
          socket.emit(
            "pullUpdateResponse",
            JSON.stringify(updates.slice(version)),
          );
        });
      }
    });

    // push updates
    socket.on("pushUpdates", (version, docUpdates) => {
      docUpdates = JSON.parse(docUpdates);

      try {
        if (version != updates.length) {
          socket.emit("pushUpdateResponse", false);
        } else {
          for (let update of docUpdates) {
            // Convert the JSON representation to an actual ChangeSet instance
            let changes = ChangeSet.fromJSON(update.changes);
            updates.push({ changes, clientID: update.clientID });
            doc = changes.apply(doc);
          }
          socket.emit("pushUpdateResponse", true);

          while (pending.length) {
            pending.pop()(updates);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("getDocument", () => {
      socket.emit("getDocumentResponse", updates.length, doc.toString());
    });
  });

  server.listen(8080, "0.0.0.0");
});
