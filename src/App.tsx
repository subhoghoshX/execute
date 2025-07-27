import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ReactCodeMirror, { keymap } from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { MonitorCog, Moon, Settings, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vim } from "@replit/codemirror-vim";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip";
import { expandAbbreviation } from "@emmetio/codemirror6-plugin";
import { indentWithTab } from "@codemirror/commands";
import { useParams } from "react-router";
import { useDarkMode } from "./lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

export default function App() {
  const { projectId } = useParams();
  const project = useQuery(api.projects.get, projectId ? { id: projectId as Id<"projects"> } : "skip");

  if (project === undefined) {
    return <main className="flex h-screen items-center justify-center">Fetching project...</main>;
  } else if (project === null) {
    return <main className="flex h-screen items-center justify-center">The project doesn't exist.</main>;
  } else {
    return <Editor project={project} />;
  }
}

export function Editor({ project }: { project: { _id: Id<"projects">; html: string; css: string; js: string } }) {
  const [htmlBuffer, setHtmlBuffer] = useState(project.html);
  const [cssBuffer, setCssBuffer] = useState(project.css);
  const [jsBuffer, setJsBuffer] = useState(project.js);

  const [htmlCode, setHtmlCode] = useState(htmlBuffer);
  const [cssCode, setCssCode] = useState(cssBuffer);
  const [jsCode, setJsCode] = useState(jsBuffer);

  const isHtmlDirty = htmlBuffer !== htmlCode;
  const isCssDirty = cssBuffer !== cssCode;
  const isJsDirty = jsBuffer !== jsCode;

  const [activeTab, setActiveTab] = useState("html");

  const [isVimEnabled, setIsVimEnabled] = useState(() => {
    const value = window.localStorage.getItem("isVimEnabled");
    return value === "true" ? true : false;
  });

  const [isTailwindEnabled, setIsTailwindEnabled] = useState(() => {
    const value = window.localStorage.getItem("isTailwindEnabled");
    return value === "true" || value === null ? true : false;
  });

  const srcDoc = generateSourceDoc(htmlCode, cssCode, jsCode, isTailwindEnabled);

  const [isDark, setIsDark] = useDarkMode();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const updateProject = useMutation(api.projects.update);

  function saveEverything() {
    setHtmlCode(htmlBuffer);
    setCssCode(cssBuffer);
    setJsCode(jsBuffer);
    updateProject({ id: project._id, html: htmlBuffer, css: cssBuffer, js: jsBuffer });
  }

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35}>
          <Tabs
            defaultValue="html"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex h-full flex-col overflow-hidden"
          >
            <menu className="flex items-center gap-2 border-b border-zinc-200 p-2 dark:border-zinc-800">
              <TabsList className="mr-auto">
                <TabsTrigger value="html" className="relative">
                  HTML
                  {isHtmlDirty && <span className="absolute top-1 right-1 size-1 rounded-full bg-blue-500"></span>}
                </TabsTrigger>
                <TabsTrigger value="css" className="relative">
                  CSS
                  {isCssDirty && <span className="absolute top-1 right-1 size-1 rounded-full bg-blue-500"></span>}
                </TabsTrigger>
                <TabsTrigger value="js" className="relative">
                  JS
                  {isJsDirty && <span className="absolute top-1 right-1 size-1 rounded-full bg-blue-500"></span>}
                </TabsTrigger>
              </TabsList>

              {(isHtmlDirty || isCssDirty || isJsDirty) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        saveEverything();
                      }}
                    >
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Or press Ctrl/Cmd + S to save.</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="outline" className="flex-shrink-0">
                    <Settings className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="vim-mode"
                      checked={isVimEnabled}
                      onCheckedChange={(isChecked) => {
                        setIsVimEnabled(isChecked);
                        localStorage.setItem("isVimEnabled", isChecked.toString());
                      }}
                    />
                    <Label htmlFor="vim-mode">Vim</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="tailwind"
                      checked={isTailwindEnabled}
                      onCheckedChange={(isChecked) => {
                        setIsTailwindEnabled(isChecked);
                        localStorage.setItem("isTailwindEnabled", isChecked.toString());
                      }}
                    />
                    <Label htmlFor="tailwind">TailwindCSS</Label>
                  </div>
                  <ToggleGroup
                    type="single"
                    size="sm"
                    defaultValue="system"
                    className="justify-start"
                    variant="outline"
                  >
                    <ToggleGroupItem
                      value="system"
                      onClick={() => {
                        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                        setIsDark(isDark);
                        localStorage.setItem("theme", "system");
                      }}
                      className="px-4"
                    >
                      <MonitorCog className="size-4" />
                      System
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="light"
                      onClick={() => {
                        setIsDark(false);
                        localStorage.setItem("theme", "light");
                      }}
                    >
                      <Sun className="size-4" />
                      Light
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="dark"
                      onClick={() => {
                        setIsDark(true);
                        localStorage.setItem("theme", "dark");
                      }}
                    >
                      <Moon className="size-4" />
                      Dark
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>
              <Button
                className="relative flex items-center justify-center"
                onClick={async () => {
                  if (!htmlCode && !cssCode && !jsCode) {
                    toast("Nothing to share.", {
                      description: "Make sure to write some code and save it.",
                    });
                    return;
                  }

                  const codeString = encodeURIComponent(
                    JSON.stringify({
                      htmlCode,
                      cssCode,
                      jsCode,
                    }),
                  );

                  const url = new URL(`?code=${codeString}`, window.location.href);

                  await navigator.clipboard.writeText(url.toString());
                  toast("Link copied to clipboard");

                  window.history.replaceState(null, "", url.toString());
                }}
              >
                Share
              </Button>
            </menu>
            <TabsContent value="html" className="mt-0 flex-grow overflow-hidden">
              <ReactCodeMirror
                className="h-full [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
                value={htmlBuffer}
                onChange={(value) => setHtmlBuffer(value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
                    e.preventDefault();
                    setHtmlCode(htmlBuffer);
                    updateProject({ id: project._id, html: htmlBuffer });
                  }
                  if (e.altKey && e.key === "1") {
                    e.preventDefault();
                  }
                  if (e.altKey && e.key === "2") {
                    e.preventDefault();
                    setActiveTab("css");
                  }
                  if (e.altKey && e.key === "3") {
                    e.preventDefault();
                    setActiveTab("js");
                  }
                }}
                onCreateEditor={(view) => {
                  view.focus();
                }}
                extensions={[
                  ...(isVimEnabled ? [vim()] : []),
                  html(),
                  keymap.of([
                    {
                      key: "Tab",
                      run: expandAbbreviation,
                    },
                    // don't remove this line, it allows to use Tab for indentation in empty lines
                    // otherwise it focuses out of the editor
                    indentWithTab,
                  ]),
                ]}
                theme={isDark ? vscodeDark : vscodeLight}
                indentWithTab={false}
              />
            </TabsContent>
            <TabsContent value="css" className="mt-0 flex-grow overflow-hidden">
              <ReactCodeMirror
                className="h-full [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
                value={cssBuffer}
                onChange={(value) => setCssBuffer(value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
                    e.preventDefault();
                    setCssCode(cssBuffer);
                    updateProject({ id: project._id, css: cssBuffer });
                  }
                  if (e.altKey && e.key === "1") {
                    e.preventDefault();
                    setActiveTab("html");
                  }
                  if (e.altKey && e.key === "2") {
                    e.preventDefault();
                  }
                  if (e.altKey && e.key === "3") {
                    e.preventDefault();
                    setActiveTab("js");
                  }
                }}
                onCreateEditor={(view) => {
                  view.focus();
                }}
                extensions={[...(isVimEnabled ? [vim()] : []), css()]}
                theme={isDark ? vscodeDark : vscodeLight}
              />
            </TabsContent>
            <TabsContent value="js" className="mt-0 flex-grow overflow-hidden">
              <ReactCodeMirror
                className="h-full [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
                value={jsBuffer}
                onChange={(value) => setJsBuffer(value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
                    e.preventDefault();
                    setJsCode(jsBuffer);
                    updateProject({ id: project._id, js: jsBuffer });
                  }
                  if (e.altKey && e.key === "1") {
                    e.preventDefault();
                    setActiveTab("html");
                  }
                  if (e.altKey && e.key === "2") {
                    e.preventDefault();
                    setActiveTab("css");
                  }
                  if (e.altKey && e.key === "3") {
                    e.preventDefault();
                  }
                }}
                onCreateEditor={(view) => {
                  view.focus();
                }}
                extensions={[...(isVimEnabled ? [vim()] : []), javascript()]}
                theme={isDark ? vscodeDark : vscodeLight}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle className="bg-black outline-2 outline-black transition-all duration-500 hover:bg-blue-500 hover:outline-blue-500" />
        <ResizablePanel defaultSize={65}>
          <iframe className="h-full w-full bg-white" srcDoc={srcDoc}></iframe>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster />
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
      ${isTailwindEnabled ? '<script src="https://cdn.tailwindcss.com"></script>' : ""}
    </head>
    <body>
      ${html}
      <script type="text/javascript">
        ${js}
      </script>
    </body>
    </html>
  `;
}
