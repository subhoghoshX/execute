import { MutableRefObject } from "react";
import { useDocStore } from "../store/doc";

interface Props {}

export default function Preview({}: Props) {
  const html = useDocStore((state) => state.html);
  const css = useDocStore((state) => state.css);
  const js = useDocStore((state) => state.js);

  return (
    <iframe
      className="h-full w-full"
      srcDoc={`<style>${css}</style>${html}<script>${js}</script>`}
    ></iframe>
  );
}
