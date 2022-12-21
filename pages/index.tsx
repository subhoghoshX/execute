import Head from "next/head";
import { useRef, useState } from "react";
import Editor from "../components/LeftPane";
import Preview from "../components/RightPane";

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

        <Preview resize={resize} showOverlay={showOverlay} />
      </main>
    </div>
  );
}
