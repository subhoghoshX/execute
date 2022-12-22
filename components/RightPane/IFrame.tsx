import { useEffect, useRef } from "react";
import { useDocStore } from "../../store/doc";

interface Props {
  twEnabled: boolean;
}

export default function IFrame({ twEnabled }: Props) {
  const html = useDocStore((state) => state.html);
  const css = useDocStore((state) => state.css);
  const js = useDocStore((state) => state.js);

  const iframeRef = useRef<null | HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument.body.innerHTML = `${html}<style>${css}</style>`;
      const head = iframeRef.current.contentDocument.querySelector("head");
      const myscript = document.createElement("script");
      myscript.type = "text/javascript";
      myscript.innerText = js;
      head?.appendChild(myscript);
    }
  }, [html, css, js]);

  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      if (twEnabled) {
        iframeRef.current.srcdoc = `<style>${css}</style>${html}<script src='https://cdn.tailwindcss.com'></script><script>${js}</script>`;
      } else {
        iframeRef.current.srcdoc = `<style>${css}</style>${html}<script>${js}</script>`;
      }
    }
  }, [twEnabled]);

  return <iframe className="h-full w-full" ref={iframeRef}></iframe>;
}
