import ReactCodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { useEffect, useMemo, useState } from "react";
import { dracula } from "@uiw/codemirror-theme-dracula";
import type { Extension } from "@codemirror/state";

import { getDocument, peerExtension } from "../../utils/peerExtension";
import { useDocStore } from "../../store/doc";
import io from "socket.io-client";
export const socket = io();

interface Props {
  vimMode: Extension[];
  activeEditor: string;
}

export default function Editor({ vimMode, activeEditor }: Props) {
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [version, setVersion] = useState<number | null>(null);

  const setHtml = useDocStore((state) => state.setHtml);
  const setCss = useDocStore((state) => state.setCss);
  const setJs = useDocStore((state) => state.setJs);

  useEffect(() => {
    console.log("huaaaaaaaaaaaaaaaa");
    getDocument().then(({ version, doc }) => {
      setHtmlCode(doc.toString());
      setVersion(version);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pullUpdateResponse");
      socket.off("pushUpdateResponse");
      socket.off("getDocumentResponse");
    };
  }, []);

  const extension = useMemo(() => {
    if (version === null) {
      return null;
    }
    return peerExtension(version);
  }, [version]);

  return (
    <>
      {htmlCode !== null && version !== null && extension !== null && (
        <ReactCodeMirror
          value={htmlCode}
          height="200px"
          onChange={setHtml}
          extensions={[...vimMode, extension, html()]}
          className={`flex-grow overflow-hidden ${
            activeEditor == "html" ? "" : "hidden"
          }`}
          theme={dracula}
        />
      )}
      <ReactCodeMirror
        value={cssCode}
        height="200px"
        onChange={setCss}
        extensions={[css()]}
        className={`flex-grow overflow-hidden ${
          activeEditor == "css" ? "" : "hidden"
        }`}
        theme={dracula}
      />
      <ReactCodeMirror
        value={jsCode}
        height="200px"
        onChange={setJs}
        extensions={[javascript()]}
        className={`flex-grow overflow-hidden ${
          activeEditor == "js" ? "" : "hidden"
        }`}
        theme={dracula}
      />
    </>
  );
}
