import { useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Plus, FileCode } from "lucide-react";

interface AddFileButtonProps {
  onFileAdded?: () => void;
}

export function AddFileButton({ onFileAdded }: AddFileButtonProps) {
  const { sandpack } = useSandpack();
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const getDefaultContent = (name: string, ext: string) => {
    const componentName =
      name
        .replace(/\.(js|jsx|ts|tsx)$/, "")
        .split("/")
        .pop() || "Component";

    switch (ext) {
      case "jsx":
      case "js":
        return `export default function ${componentName}() {
  return (
    <div>
      <h2>${componentName}</h2>
    </div>
  );
}`;
      case "tsx":
      case "ts":
        return `interface ${componentName}Props {}

export default function ${componentName}({}: ${componentName}Props) {
  return (
    <div>
      <h2>${componentName}</h2>
    </div>
  );
}`;
      case "css":
        return `/* Styles for ${componentName} */
`;
      default:
        return "";
    }
  };

  const handleCreateFile = () => {
    if (!fileName) return;

    const filePath = fileName.startsWith("/") ? fileName : `/${fileName}`;

    // Check if file already exists
    if (sandpack.files[filePath]) {
      alert(`File ${filePath} already exists`);
      return;
    }

    // Get file extension for default content
    const ext = filePath.split(".").pop() || "js";
    const defaultContent = getDefaultContent(fileName, ext);

    // Update the Sandpack state
    sandpack.updateFile(filePath, defaultContent);
    sandpack.openFile(filePath);

    // Reset form
    setFileName("");
    setIsOpen(false);

    if (onFileAdded) {
      onFileAdded();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="h-6 w-6 p-0">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Create New File</h4>
            <p className="text-muted-foreground text-sm">Enter the file name with extension</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <input
              id="fileName"
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Component.jsx"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFile();
                }
              }}
              autoFocus
            />
          </div>
          <Button onClick={handleCreateFile} className="w-full">
            <FileCode className="mr-2 h-4 w-4" />
            Create File
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
