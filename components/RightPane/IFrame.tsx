import { useDocStore } from "../../store/doc";

interface Props {
  twEnabled: boolean;
}

export default function IFrame({ twEnabled }: Props) {
  const html = useDocStore((state) => state.html);
  const css = useDocStore((state) => state.css);
  const js = useDocStore((state) => state.js);

  return (
    <iframe
      className="h-full w-full"
      srcDoc={`<style>${css}</style>${html}${
        twEnabled ? '<script src="https://cdn.tailwindcss.com"></script>' : ""
      }<script>${js}</script>`}
    ></iframe>
  );
}
