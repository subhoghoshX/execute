import Head from "next/head";
import { useRef, useState } from "react";
import Editor from "../components/Editor";
import Preview from "../components/Preview";

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [resize, setResize] = useState(0);

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
        <Editor
          setShowOverlay={setShowOverlay}
          resize={resize}
          setResize={setResize}
        />
        <section
          className="relative"
          style={{
            width: resize ? `${window.innerWidth - resize}px` : "50%",
            minWidth: 240,
          }}
        >
          {showOverlay && <span className="absolute inset-0"></span>}
          <Preview />
        </section>
      </main>
    </div>
  );
}
