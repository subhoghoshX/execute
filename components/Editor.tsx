import Logo from "../components/Logo";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import { MutableRefObject, useEffect, useState } from "react";
import { css } from "@codemirror/lang-css";

interface Props {
  iframeRef: MutableRefObject<HTMLIFrameElement | null>;
}

type ActiveEditor = "html" | "css" | "js";

export default function ({ iframeRef }: Props) {
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>("html");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument.body.innerHTML = `${htmlCode}<style>${cssCode}</style><script>${jsCode}</script>`;
    }
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="flex w-1/2 bg-zinc-900">
      <section className="flex h-screen flex-grow flex-col">
        <div>
          <Logo />
        </div>
        <menu>
          <button
            className="text-white"
            onClick={() => setActiveEditor("html")}
          >
            HTML
          </button>
          <button className="text-white" onClick={() => setActiveEditor("css")}>
            CSS
          </button>
          <button className="text-white" onClick={() => setActiveEditor("js")}>
            JavaScript
          </button>
        </menu>
        <ReactCodeMirror
          value={htmlCode}
          height="200px"
          onChange={(value) => setHtmlCode(value)}
          extensions={[html()]}
          className={`flex-grow overflow-hidden ${
            activeEditor == "html" ? "" : "hidden"
          }`}
        />
        <ReactCodeMirror
          value={cssCode}
          height="200px"
          onChange={(value) => setCssCode(value)}
          extensions={[css()]}
          className={`flex-grow overflow-hidden ${
            activeEditor == "css" ? "" : "hidden"
          }`}
        />
        <ReactCodeMirror
          value={jsCode}
          height="200px"
          onChange={(value) => setJsCode(value)}
          extensions={[javascript()]}
          className={`flex-grow overflow-hidden ${
            activeEditor == "js" ? "" : "hidden"
          }`}
        />
      </section>
      <button className="w-2 cursor-ew-resize bg-blue-100"></button>
    </div>
  );
}
