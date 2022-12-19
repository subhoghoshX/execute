import Logo from "../components/Logo";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { css } from "@codemirror/lang-css";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { getDocument, peerExtension } from "../utils/peerExtension";
import io from "socket.io-client";
import { useDocStore } from "../store/doc";
import { vim } from "@replit/codemirror-vim";
import type { Extension } from "@codemirror/state";
export const socket = io();

interface Props {
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  resize: number;
  setResize: Dispatch<SetStateAction<number>>;
}

type ActiveEditor = "html" | "css" | "js";

export default function Editor({ setShowOverlay, resize, setResize }: Props) {
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>("html");
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [version, setVersion] = useState<number | null>(null);
  const [vimMode, setVimMode] = useState<Extension[]>([]);

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

  function mouseDownHandler() {
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    setShowOverlay(true);
  }

  function mouseMoveHandler(e: MouseEvent) {
    setResize((resize) => {
      if (resize >= 6 && resize <= window.innerWidth - 240) {
        return resize + e.movementX;
      } else if (resize > window.innerWidth / 2) {
        return window.innerWidth - 240;
      } else {
        return 6;
      }
    });
  }

  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    setShowOverlay(false);
  }

  useEffect(() => {
    setResize(window.innerWidth / 2);
  }, []);

  function enableVim(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setVimMode([vim()]);
    } else {
      setVimMode([]);
    }
  }

  return (
    <div
      className="flex w-1/2 bg-zinc-900"
      style={{ width: resize ? `${resize}px` : "50%", minWidth: "6px" }}
    >
      <section className="flex h-screen flex-grow flex-col overflow-hidden">
        <div className="py-2 px-1">
          <Logo />
          <label>
            <input type="checkbox" onChange={enableVim} />
            <span className="ml-1 text-white">Vim Mode</span>
          </label>
        </div>
        <menu className="space-x-px whitespace-nowrap">
          <button
            className={`border-t px-5 py-1 text-white ${
              activeEditor == "html"
                ? "border-cyan-400 bg-[#282a36]"
                : "border-transparent bg-[#383a46]"
            }`}
            onClick={() => setActiveEditor("html")}
          >
            HTML
          </button>
          <button
            className={`border-t px-5 py-1 text-white ${
              activeEditor == "css"
                ? "border-cyan-400 bg-[#282a36]"
                : "border-transparent bg-[#383a46]"
            }`}
            onClick={() => setActiveEditor("css")}
          >
            CSS
          </button>
          <button
            className={`border-t px-5 py-1 text-white ${
              activeEditor == "js"
                ? "border-cyan-400 bg-[#282a36]"
                : "border-transparent bg-[#383a46]"
            }`}
            onClick={() => setActiveEditor("js")}
          >
            JavaScript
          </button>
        </menu>
        {htmlCode !== null && version !== null && (
          <ReactCodeMirror
            value={htmlCode}
            height="200px"
            onChange={setHtml}
            extensions={[...vimMode, peerExtension(version), html()]}
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
      </section>
      <button
        className="w-1.5 flex-shrink-0 cursor-ew-resize bg-cyan-500"
        onMouseDown={mouseDownHandler}
      ></button>
    </div>
  );
}
