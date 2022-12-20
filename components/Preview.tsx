import { MutableRefObject } from "react";
import { useDocStore } from "../store/doc";

interface Props {
  resize: number;
  showOverlay: boolean;
}

export default function Preview({ resize, showOverlay }: Props) {
  const html = useDocStore((state) => state.html);
  const css = useDocStore((state) => state.css);
  const js = useDocStore((state) => state.js);

  return (
    <section
      className="relative"
      style={{
        width: resize ? `${window.innerWidth - resize}px` : "50%",
        minWidth: 240,
      }}
    >
      {showOverlay && <span className="absolute inset-0"></span>}
      <iframe
        className="h-full w-full"
        srcDoc={`<style>${css}</style>${html}<script>${js}</script>`}
      ></iframe>
    </section>
  );
}
