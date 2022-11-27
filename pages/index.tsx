import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import Head from "next/head";
import { useRef } from "react";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function onChange(value: string) {
    // console.log({ value });
    if(iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument.body.innerHTML= value
    }
  }

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
      <main>
        <h1 className="text-red-500">Hello World</h1>
        <ReactCodeMirror
          value="console.log('hello world');"
          height="200px"
          onChange={onChange}
          extensions={[html()]}
        />
      </main>
      <iframe ref={iframeRef}></iframe>
    </div>
  );
}
