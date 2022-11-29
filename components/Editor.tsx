import Logo from "../components/Logo";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import { MutableRefObject, useEffect, useState } from "react";
import { css } from "@codemirror/lang-css";

interface Props {
  iframeRef: MutableRefObject<HTMLIFrameElement | null>;
}

export default function ({ iframeRef }: Props) {
  const [currentLang, setCurrentLang] = useState(0);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument.body.innerHTML = `${htmlCode}<style>${cssCode}</style><script>${jsCode}</script>`;
    }
  }, [htmlCode, cssCode, jsCode]);

  return (
    <section className="w-1/2 bg-zinc-900">
      <Logo />
      <menu>
        <button className="text-white" onClick={() => setCurrentLang(0)}>
          HTML
        </button>
        <button className="text-white" onClick={() => setCurrentLang(1)}>
          CSS
        </button>
        <button className="text-white" onClick={() => setCurrentLang(2)}>
          JavaScript
        </button>
      </menu>
      <ReactCodeMirror
        value={htmlCode}
        height="200px"
        onChange={(value) => setHtmlCode(value)}
        extensions={[html()]}
      />
      <ReactCodeMirror
        value={cssCode}
        height="200px"
        onChange={(value) => setCssCode(value)}
        extensions={[css()]}
      />
      <ReactCodeMirror
        value={jsCode}
        height="200px"
        onChange={(value) => setJsCode(value)}
        extensions={[javascript()]}
      />
    </section>
  );
}
