import {
  collab,
  getSyncedVersion,
  receiveUpdates,
  sendableUpdates,
  Update,
} from "@codemirror/collab";
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { socket } from "../components/Editor";
import { ChangeSet, Text } from "@codemirror/state";

export function peerExtension(startVersion: number) {
  console.log("peer extension");
  class Plugin {
    private pushing = false;
    private done = false;

    constructor(private view: EditorView) {
      this.pull();
    }

    update(update: ViewUpdate) {
      if (update.docChanged) this.push();
    }

    async push() {
      const updates = sendableUpdates(this.view.state);
      if (this.pushing || !updates.length) return;
      this.pushing = true;
      const version = getSyncedVersion(this.view.state);
      await pushUpdates(version, updates);
      this.pushing = false;
      // Regardless of whethere the push failed or new updates came in
      // while it was running, try again if there's updates remaining
      if (sendableUpdates(this.view.state).length) {
        setTimeout(() => this.push(), 100);
      }
    }

    async pull() {
      while (!this.done) {
        const version = getSyncedVersion(this.view.state);
        const updates = await pullUpdates(version);
        this.view.dispatch(receiveUpdates(this.view.state, updates));
      }
    }

    destroy() {
      this.done = true;
    }
  }

  const plugin = ViewPlugin.fromClass(Plugin);

  return [collab({ startVersion }), plugin];
}

function pushUpdates(
  version: number,
  fullUpdates: readonly Update[],
): Promise<boolean> {
  // Strip of transaction data
  const updates = fullUpdates.map((u) => ({
    clientID: u.clientID,
    changes: u.changes.toJSON(),
  }));

  return new Promise((resolve) => {
    socket.emit("pushUpdates", version, JSON.stringify(updates));

    socket.once("pushUpdateResponse", (status: boolean) => {
      resolve(status);
    });
  });
}

function pullUpdates(version: number): Promise<readonly Update[]> {
  return new Promise((resolve) => {
    socket.emit("pullUpdates", version);

    socket.once("pullUpdateResponse", (updates: any) => {
      resolve(JSON.parse(updates));
    });
  }).then((updates: any) =>
    updates.map((u: any) => ({
      changes: ChangeSet.fromJSON(u.changes),
      clientID: u.clientID,
    })),
  );
}

export function getDocument(): Promise<{ version: number; doc: Text }> {
  return new Promise((resolve) => {
    socket.emit("getDocument");

    socket.once("getDocumentResponse", (version: number, doc: string) => {
      resolve({
        version,
        doc: Text.of(doc.split("\n")),
      });
    });
  });
}
