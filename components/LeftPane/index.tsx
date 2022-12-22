import Logo from "./Logo";
import type { Extension } from "@codemirror/state";

import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { vim } from "@replit/codemirror-vim";

import Editor from "./Editor";

interface Props {
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  resize: number;
  setResize: Dispatch<SetStateAction<number>>;
}

type ActiveEditor = "html" | "css" | "js";

export default function LeftPane({ setShowOverlay, resize, setResize }: Props) {
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>("html");

  const [vimMode, setVimMode] = useState<Extension[]>([]);

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

        <Editor activeEditor={activeEditor} vimMode={vimMode} />
      </section>
      <button
        className="w-1.5 flex-shrink-0 cursor-ew-resize bg-cyan-500"
        onMouseDown={mouseDownHandler}
      ></button>
    </div>
  );
}
