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
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const codeObj = JSON.parse(decodeURIComponent(params.get("code") ?? "{}"));
  const [htmlBuffer, setHtmlBuffer] = useState(codeObj.htmlCode ?? "");
  const [cssBuffer, setCssBuffer] = useState(codeObj.cssCode ?? "");
  const [jsBuffer, setJsBuffer] = useState(codeObj.jsCode ?? "");

  const [htmlCode, setHtmlCode] = useState(htmlBuffer);
  const [cssCode, setCssCode] = useState(cssBuffer);
  const [jsCode, setJsCode] = useState(jsBuffer);

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

  const [isDark, setIsDark] = useDarkMode();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const { toast } = useToast();

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40}>
          <Tabs defaultValue="html" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
            <menu className="p-2 border-b border-zinc-200 flex items-center gap-2 dark:border-zinc-800">
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
                  <Button size="icon" variant="outline" className="flex-shrink-0">
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
                    <ToggleGroupItem
                      value="system"
                      onClick={() => {
                        const isDark = window.matchMedia(
                          "(prefers-color-scheme: dark)",
                        ).matches;
                        setIsDark(isDark);
                        localStorage.setItem("theme", "system");
                      }}
                    >
                      <MonitorCog className="size-4 mr-2" />
                      System
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="light"
                      onClick={() => {
                        setIsDark(false);
                        localStorage.setItem("theme", "light")
                      }}
                    >
                      <Sun className="size-4 mr-2" />
                      Light
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="dark"
                      onClick={() => {
                        setIsDark(true);
                        localStorage.setItem("theme", "dark")
                      }}
                    >
                      <Moon className="size-4 mr-2" />
                      Dark
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>
              <Button
                className="relative flex justify-center items-center"
                onClick={async () => {
                  if (!htmlCode && !cssCode && !jsCode) {
                    toast({
                      title: "Nothing to share.",
                      description: "Make sure to write some code and save it."
                    });
                    return;
                  }

                  const codeString = encodeURIComponent(JSON.stringify({
                    htmlCode,
                    cssCode,
                    jsCode
                  }));

                  const url = new URL(`?code=${codeString}`, window.location.href)

                  await navigator.clipboard.writeText(url.toString());
                  toast({
                    title: "Link copied to clipboard",
                  });

                  window.history.replaceState(null, "", url.toString());
                }}
              >Share</Button>
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
                theme={isDark ? vscodeDark : vscodeLight}
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
                theme={isDark ? vscodeDark : vscodeLight}
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
                theme={isDark ? vscodeDark : vscodeLight}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
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

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      return true;
    } else if (theme === "light") {
      return false;
    } else {
      const isDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      return isDark;
    }
  });

  useEffect(() => {
    function setDarkMode() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        setIsDark(true);
      } else if (theme === "light") {
        setIsDark(false);
      } else {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setIsDark(isDark);
      }
    }

    window.addEventListener("storage", setDarkMode);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", setDarkMode);

    return () => {
      window.removeEventListener("storage", setDarkMode);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", setDarkMode);
    }
  }, []);

  return [isDark, setIsDark] as const;
}
