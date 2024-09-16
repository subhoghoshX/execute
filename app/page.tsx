"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import ReactCodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { MonitorCog, Moon, Settings, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vim } from "@replit/codemirror-vim";

export default function Home() {
  const [htmlBuffer, setHtmlBuffer] = useState("");
  const [cssBuffer, setCssBuffer] = useState("");
  const [jsBuffer, setJsBuffer] = useState("");

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  const isHtmlDirty = htmlBuffer !== htmlCode;
  const isCssDirty = cssBuffer !== cssCode;
  const isJsDirty = jsBuffer !== jsCode;

  const [activeTab, setActiveTab] = useState("html");

  const [isVimEnabled, setIsVimEnabled] = useState(false);
  useEffect(() => {
    const value = window.localStorage.getItem("isVimEnabled");
    if (value === "true"){
      setIsVimEnabled(true);
    } else {
      setIsVimEnabled(false);
    }
  }, []);

  const [isTailwindEnalbed, setIsTailwindEnabled] = useState(false);
  useEffect(() => {
    const value = window.localStorage.getItem("isTailwindEnabled") ?? false;
    if (value === "true") {
      setIsTailwindEnabled(true);
    } else {
      setIsTailwindEnabled(false);
    }
  }, []);

  const srcDoc = generateSourceDoc(htmlCode, cssCode, jsCode, isTailwindEnalbed);

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <Tabs defaultValue="html" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
            <menu className="p-2 border-b border-zinc-200 flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="html" className="relative">
                  HTML
                  {isHtmlDirty && (
                    <span className="size-1 rounded-full absolute bg-blue-500 top-1 right-1"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="css" className="relative">
                  CSS
                  {isCssDirty && (
                    <span className="size-1 rounded-full absolute bg-blue-500 top-1 right-1"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="js" className="relative">
                  JS
                  {isJsDirty && (
                    <span className="size-1 rounded-full absolute bg-blue-500 top-1 right-1"></span>
                  )}
                </TabsTrigger>
              </TabsList>

              <Popover>
                <PopoverTrigger className="ml-auto" asChild>
                  <Button size="icon" variant="outline">
                    <Settings className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Switch id="vim-mode" checked={isVimEnabled} onCheckedChange={(isChecked) => {
                      setIsVimEnabled(isChecked);
                      localStorage.setItem("isVimEnabled", isChecked.toString());
                    }
                    } />
                    <Label htmlFor="vim-mode">Vim</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="tailwind" checked={isTailwindEnalbed} onCheckedChange={(isChecked) => {
                      setIsTailwindEnabled(isChecked);
                      localStorage.setItem("isTailwindEnabled", isChecked.toString());
                    }
                    } />
                    <Label htmlFor="tailwind">TailwindCSS</Label>
                  </div>
                  <ToggleGroup type="single" size="sm" defaultValue="system" className="justify-start" variant="outline">
                    <ToggleGroupItem value="system">
                      <MonitorCog className="size-4 mr-2" />
                      System
                    </ToggleGroupItem>
                    <ToggleGroupItem value="light">
                      <Sun className="size-4 mr-2" />
                      Light
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark">
                      <Moon className="size-4 mr-2" />
                      Dark
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>
              <Button>Share</Button>
            </menu>
            <TabsContent value="html" className="mt-0 flex-grow overflow-hidden">
              <ReactCodeMirror
                className="h-full [&>.cm-editor]:outline-none [&>.cm-editor]:h-full"
                value={htmlBuffer}
                onChange={(value) => setHtmlBuffer(value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    setHtmlCode(htmlBuffer);
                  }
                  if (e.altKey && e.key === '1') {
                    e.preventDefault();
                  }
                  if (e.altKey && e.key === '2') {
                    e.preventDefault();
                    setActiveTab("css");
                  }
                  if (e.altKey && e.key === '3') {
                    e.preventDefault();
                    setActiveTab("js");
                  }
                }}
                onCreateEditor={(view) => {
                  view.focus();
                }}
                extensions={[...(isVimEnabled ? [vim()] : []), html()]}
              />
            </TabsContent>
            <TabsContent value="css" className="mt-0 flex-grow">
              <ReactCodeMirror
                className="h-full [&>.cm-editor]:outline-none [&>.cm-editor]:h-full"
                value={cssBuffer}
                onChange={(value) => setCssBuffer(value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    setCssCode(cssBuffer);
                  }
                  if (e.altKey && e.key === '1') {
                    e.preventDefault();
                    setActiveTab("html");
                  }
                  if (e.altKey && e.key === '2') {
                    e.preventDefault();
                  }
                  if (e.altKey && e.key === '3') {
                    e.preventDefault();
                    setActiveTab("js");
                  }
                }}
                onCreateEditor={(view) => {
                  view.focus();
                }}
                extensions={[...(isVimEnabled ? [vim()] : []), css()]}
              />
            </TabsContent>
            <TabsContent value="js" className="mt-0 flex-grow">
              <ReactCodeMirror
                className="h-full [&>.cm-editor]:outline-none [&>.cm-editor]:h-full"
                value={jsBuffer}
                onChange={(value) => setJsBuffer(value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    setJsCode(jsBuffer);
                  }
                  if (e.altKey && e.key === '1') {
                    e.preventDefault();
                    setActiveTab("html");
                  }
                  if (e.altKey && e.key === '2') {
                    e.preventDefault();
                    setActiveTab("css");
                  }
                  if (e.altKey && e.key === '3') {
                    e.preventDefault();
                  }
                }}
                onCreateEditor={(view) => {
                  view.focus();
                }}
                extensions={[...(isVimEnabled ? [vim()] : []), javascript()]}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <iframe className="h-full w-full" srcDoc={srcDoc}></iframe>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

function generateSourceDoc(html: string, css: string, js: string, isTailwindEnabled: boolean) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        ${css}
      </style>
      ${isTailwindEnabled ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
    </head>
    <body>
      ${html}
      <script type="text/javascript">
        ${js}
      </script>
    </body>
    </html>
  `
}
