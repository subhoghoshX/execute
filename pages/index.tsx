import Head from "next/head";
import { useRef } from "react";
import Editor from "../components/Editor";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
        <Editor iframeRef={iframeRef} />
        <iframe className="w-1/2" ref={iframeRef}></iframe>
      </main>
    </div>
  );
}
