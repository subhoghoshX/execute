import { useDocStore } from "../../store/doc";

export default function IFrame() {
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
