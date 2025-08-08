import { useSandpack } from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { Trash2, File, Folder, FolderOpen } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface CustomFileExplorerProps {
  className?: string;
}

export function CustomFileExplorer({ className }: CustomFileExplorerProps) {
  const { sandpack } = useSandpack();
  const { files, activeFile, openFile, deleteFile } = sandpack;
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  type FileNode = { type: string; path?: string; children?: Record<string, FileNode> };

  // Organize files into folder structure
  const organizeFiles = () => {
    const structure: Record<string, FileNode> = {};

    Object.keys(files).forEach((path) => {
      const parts = path.split("/").filter(Boolean);
      let current = structure;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = { type: "file", path };
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = { type: "folder", children: {} };
          }
          current = current[part].children as Record<string, FileNode>;
        }
      });
    });

    return structure;
  };

  // Collect all folder paths recursively
  const collectAllFolders = (structure: Record<string, FileNode>, parentPath = ""): string[] => {
    const folders: string[] = [];

    Object.entries(structure).forEach(([name, item]) => {
      if (item.type === "folder") {
        const folderPath = parentPath ? `${parentPath}/${name}` : name;
        folders.push(folderPath);
        if (item.children) {
          folders.push(...collectAllFolders(item.children, folderPath));
        }
      }
    });

    return folders;
  };

  const fileStructure = useMemo(() => organizeFiles(), [files]);
  const allFolders = useMemo(() => ["", ...collectAllFolders(fileStructure)], [fileStructure]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(allFolders));

  // Update expanded folders when new folders are added
  useEffect(() => {
    setExpandedFolders((prev) => new Set([...prev, ...allFolders]));
  }, [allFolders]);

  const handleDelete = () => {
    if (!fileToDelete) return;

    // Check if this is the last file
    const fileCount = Object.keys(files).length;
    if (fileCount <= 1) {
      alert("Cannot delete the last file");
      setFileToDelete(null);
      return;
    }

    // Delete the file
    deleteFile(fileToDelete);

    // If the deleted file was active, switch to another file
    if (fileToDelete === activeFile) {
      const remainingFiles = Object.keys(files).filter((f) => f !== fileToDelete);
      if (remainingFiles.length > 0) {
        openFile(remainingFiles[0]);
      }
    }

    setFileToDelete(null);
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (structure: Record<string, FileNode>, level = 0, parentPath = "") => {
    const entries = Object.entries(structure);
    const folders = entries.filter(([, item]) => item.type === "folder");
    const files = entries.filter(([, item]) => item.type === "file");

    // Sort folders and files alphabetically, then combine with folders first
    const sortedEntries = [
      ...folders.sort(([a], [b]) => a.localeCompare(b)),
      ...files.sort(([a], [b]) => a.localeCompare(b)),
    ];

    return sortedEntries.map(([name, item]) => {
      if (item.type === "file" && item.path) {
        const filePath = item.path; // Store in const to help TypeScript understand it's not undefined
        const isActive = filePath === activeFile;
        const isHovered = hoveredFile === filePath;

        return (
          <div
            key={filePath}
            className={cn(
              "group hover:bg-accent/50 flex cursor-pointer items-center justify-between px-3 py-1 transition-colors",
              isActive && "text-accent-foreground",
              "text-sm",
            )}
            style={{ paddingLeft: `${(level + 1) * 12}px` }}
            onMouseEnter={() => setHoveredFile(filePath)}
            onMouseLeave={() => setHoveredFile(null)}
            onClick={() => openFile(filePath)}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <File
                className={cn("h-3.5 w-3.5 flex-shrink-0", isActive ? "text-foreground" : "text-muted-foreground")}
              />
              <span className={cn("truncate", isActive ? "text-foreground font-medium" : "text-muted-foreground")}>
                {name}
              </span>
            </div>
            {isHovered && (
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileToDelete(filePath);
                }}
              >
                <Trash2 className="text-destructive h-3 w-3" />
              </Button>
            )}
          </div>
        );
      } else if (item.type === "folder") {
        const folderPath = parentPath ? `${parentPath}/${name}` : name;
        const isExpanded = expandedFolders.has(folderPath);

        return (
          <div key={folderPath}>
            <div
              className="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 px-3 py-1 text-sm transition-colors"
              onClick={() => toggleFolder(folderPath)}
            >
              {isExpanded ? (
                <FolderOpen className="text-muted-foreground h-3.5 w-3.5" />
              ) : (
                <Folder className="text-muted-foreground h-3.5 w-3.5" />
              )}
              <span className="text-muted-foreground font-medium">{name}</span>
            </div>
            {isExpanded && item.children && <div>{renderFileTree(item.children, level + 1, folderPath)}</div>}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <>
      <div className={cn("overflow-auto bg-white dark:bg-[#151515]", className)}>
        {Object.keys(files).length === 0 ? (
          <div className="text-muted-foreground px-3 py-2 text-sm">No files yet</div>
        ) : (
          renderFileTree(fileStructure)
        )}
      </div>

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {fileToDelete}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
