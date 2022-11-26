import ReactCodeMirror from "@uiw/react-codemirror";
import Head from "next/head";

export default function Home() {
  function onChange(value) {
    console.log({ value });
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
        />
      </main>
    </div>
  );
}
