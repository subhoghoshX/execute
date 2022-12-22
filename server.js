const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");
const { ChangeSet, Text } = require("@codemirror/state");
const { Update } = require("@codemirror/collab");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });

const handle = nextApp.getRequestHandler();

// The updates received so far (updates.length gives the current version)
const updates = { 1: [], 2: [], 3: [] };
// The current document
// let doc = Text.of(["Start document"]);
// let doc = "Start document2";
// Authority message
const pending = { 1: [], 2: [], 3: [] };

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
    socket.on("pullUpdates", (version, documentID) => {
      if (version < updates[documentID].length) {
        socket.emit(
          "pullUpdateResponse",
          JSON.stringify(updates[documentID].slice(version)),
        );
      } else {
        pending[documentID].push((updates) => {
          socket.emit(
            "pullUpdateResponse",
            // as i'm already doing this below (in while loop) -> pending.pop()(updates[documentID]);
            JSON.stringify(updates.slice(version)),
          );
        });
      }
    });

    // push updates
    socket.on("pushUpdates", async (version, docUpdates, documentID) => {
      docUpdates = JSON.parse(docUpdates);

      try {
        if (version != updates[documentID].length) {
          socket.emit("pushUpdateResponse", false);
        } else {
          for (let update of docUpdates) {
            // Convert the JSON representation to an actual ChangeSet instance
            let changes = ChangeSet.fromJSON(update.changes);
            updates[documentID].push({ changes, clientID: update.clientID });
            // doc = changes.apply(doc);
            const document = await prisma.document.findUnique({
              where: {
                id: 1,
              },
            });
            const text = changes.apply(Text.of([document.text])).toString();
            await prisma.document.update({
              where: {
                id: 1,
              },
              data: {
                text: text,
              },
            });
          }
          socket.emit("pushUpdateResponse", true);

          while (pending[documentID].length) {
            pending[documentID].pop()(updates[documentID]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("getDocument", async () => {
      let documents = await prisma.document.findMany({
        where: {
          projectId: 1,
        },
      });
      // strip away everything except text
      documents = documents.map((document) => document.text);
      socket.emit(
        "getDocumentResponse",
        [updates[1].length, updates[2].length, updates[3].length],
        documents,
      );
    });
  });

  server.listen(8080, "0.0.0.0");
});
