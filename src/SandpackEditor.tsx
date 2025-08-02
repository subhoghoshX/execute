import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  FileTabs,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Settings, Sun, Moon, MonitorCog } from "lucide-react";
import { useDarkMode } from "./lib/utils";
import { useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useNavigate } from "react-router";

const defaultFiles = {
  "/App.js": {
    code: `export default function App() {
  return <h1>Hello world</h1>
}`,
  },
};

interface SandpackEditorProps {
  project: {
    _id: Id<"projects">;
    files?: Record<string, { code: string }>;
  };
}

interface SaveButtonProps {
  projectId: Id<"projects">;
  project: { files?: Record<string, { code: string }> };
}

function SaveButton({ projectId, project }: SaveButtonProps) {
  const { sandpack } = useSandpack();
  const updateProject = useMutation(api.projects.update);

  const handleSave = useCallback(async () => {
    const files = sandpack.files;
    const formattedFiles: Record<string, { code: string }> = {};

    Object.entries(files).forEach(([path, file]) => {
      formattedFiles[path] = { code: file.code };
    });

    await updateProject({ id: projectId, files: formattedFiles });
  }, [sandpack.files, updateProject, projectId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Check if there are changes by comparing current files with saved files
  const hasChanges = () => {
    const currentFiles = sandpack.files;
    const savedFiles = project.files || {};

    // If different number of files, there are changes
    if (Object.keys(currentFiles).length !== Object.keys(savedFiles).length) {
      return true;
    }

    // Check if any file content has changed
    for (const [path, file] of Object.entries(currentFiles)) {
      if (!savedFiles[path] || savedFiles[path].code !== file.code) {
        return true;
      }
    }

    return false;
  };

  if (!hasChanges()) {
    return null;
  }

  return (
    <Button onClick={handleSave} variant="outline">
      Save
    </Button>
  );
}

export default function SandpackEditor({ project }: SandpackEditorProps) {
  const [isDark, setIsDark] = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const files = project.files || defaultFiles;

  return (
    <main className="h-screen">
      <SandpackProvider
        template="react"
        files={files}
        theme={isDark ? "dark" : "light"}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        className="!h-full"
      >
        <div className="flex h-full flex-col gap-1">
          <menu className="flex items-center justify-end gap-2 border-b border-zinc-200 p-2 dark:border-zinc-800">
            <SaveButton projectId={project._id} project={project} />

            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" className="flex-shrink-0">
                  <Settings className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-3">
                <Label>Theme</Label>
                <ToggleGroup type="single" size="sm" defaultValue="system" className="justify-start" variant="outline">
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
                <div className="mt-3 border-t pt-3">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/${project._id}`)}>
                    Switch to Classic Mode
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </menu>

          <SandpackLayout className="flex-1">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={10} minSize={10}>
                <SandpackFileExplorer className="h-full" />
              </ResizablePanel>
              <ResizableHandle className="bg-gray-300 outline-2 outline-gray-300 transition-all duration-500 hover:bg-blue-500 hover:outline-blue-500 dark:bg-black dark:outline-black" />
              <ResizablePanel defaultSize={40} className="flex h-full flex-col">
                <ScrollArea className="shrink-0 border-b">
                  <FileTabs className="[&_[role=tab]]:!outline-none" />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <SandpackCodeEditor showTabs={false} showLineNumbers showInlineErrors className="flex-1" />
              </ResizablePanel>
              <ResizableHandle className="bg-gray-300 outline-2 outline-gray-300 transition-all duration-500 hover:bg-blue-500 hover:outline-blue-500 dark:bg-black dark:outline-black" />
              <ResizablePanel defaultSize={50}>
                <SandpackPreview className="h-full" showOpenInCodeSandbox={false} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </SandpackLayout>
        </div>
      </SandpackProvider>
    </main>
  );
}
