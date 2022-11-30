import Head from "next/head";
import { useRef, useState } from "react";
import Editor from "../components/Editor";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div>
      <Head>
        <title>Execute</title>
        <meta
          name="description"
          content="An editor bring your ideas to life."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="md:flex">
        <Editor iframeRef={iframeRef} setShowOverlay={setShowOverlay} />
        <section className="relative flex-grow">
          {showOverlay && <span className="absolute inset-0"></span>}
          <iframe className="h-full w-full" ref={iframeRef}></iframe>
        </section>
      </main>
    </div>
  );
}
