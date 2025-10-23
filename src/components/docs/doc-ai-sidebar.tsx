"use client";
import { useState, useEffect } from "react";
import { File, Folder, Loader2, ChevronRight, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Repository } from "@/lib/types";

type DocEntry = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: DocEntry[];
};

export function DocAiSidebar({ repoId }: { repoId: string }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const pathname = usePathname();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!apiBaseUrl) return;
    fetch(`${apiBaseUrl}/api/repos`)
      .then(res => res.json())
      .then((data: Repository[]) => {
        setRepos(data);
        const currentRepo = data.find(r => r.id.toString() === repoId);
        setSelectedRepo(currentRepo || null);
      });
  }, [repoId, apiBaseUrl]);

  useEffect(() => {
    if (selectedRepo && apiBaseUrl) {
      setLoadingDocs(true);
      fetch(`${apiBaseUrl}/api/repos/${selectedRepo.id}/doc_ai`)
        .then(res => res.json())
        .then((data: DocEntry[]) => {
          setDocs(data);
          setLoadingDocs(false);
        })
        .catch(() => {
          setDocs([]);
          setLoadingDocs(false);
        });
    }
  }, [selectedRepo, apiBaseUrl]);
  
  useEffect(() => {
    if (repoId) {
      const storedState = localStorage.getItem(`expandedFolders_${repoId}`);
      if (storedState) {
        setExpandedFolders(JSON.parse(storedState));
      }
    }
  }, [repoId]);

  const toggleFolder = (path: string) => {
    if (!repoId) return;
    const newExpandedFolders = expandedFolders.includes(path)
      ? expandedFolders.filter(p => p !== path)
      : [...expandedFolders, path];
    setExpandedFolders(newExpandedFolders);
    localStorage.setItem(`expandedFolders_${repoId}`, JSON.stringify(newExpandedFolders));
  };


  const renderTree = (nodes: DocEntry[], parentPath: string = '') => {
    return (
        <ul className="space-y-1">
            {nodes.map((node, index) => {
                const isExpanded = expandedFolders.includes(node.path);
                return (
                    <li key={index}>
                        {node.type === 'folder' ? (
                            <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(node.path)}>
                                <CollapsibleTrigger className="w-full">
                                    <div className={cn(
                                        "flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-muted w-full"
                                    )}>
                                        <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                                        <Folder className="h-4 w-4" />
                                        <span>{node.name}</span>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="pl-6">
                                        {node.children && renderTree(node.children, node.path)}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <Link href={`/docs/${repoId}/${node.path.replace('doc_ai/','')}`} className={cn(
                                "flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted ml-4",
                                pathname === `/docs/${repoId}/${node.path.replace('doc_ai/','')}` && "bg-muted font-semibold"
                            )}>
                                <File className="h-4 w-4 ml-2" />
                                <span>{node.name}</span>
                            </Link>
                        )}
                    </li>
                )
            })}
        </ul>
    );
  };
  
  return (
    <aside className="border-r bg-background flex flex-col">
      <div className="p-4 space-y-4 border-b">
        <h2 className="text-lg font-semibold font-headline">Проекты</h2>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedRepo ? selectedRepo.name : "Выберите проект..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Поиск проекта..." />
                    <CommandList>
                        <CommandEmpty>Проекты не найдены.</CommandEmpty>
                        <CommandGroup>
                            {repos.map((repo) => (
                                <CommandItem
                                    key={repo.id}
                                    value={repo.id.toString()}
                                    onSelect={(currentValue) => {
                                        const repo = repos.find(r => r.id.toString() === currentValue);
                                        setSelectedRepo(repo || null);
                                        setOpen(false);
                                        // Navigate to the new repo's doc page
                                        window.location.href = `/docs/${currentValue}`;
                                    }}
                                >
                                    {repo.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-md font-semibold font-headline mb-2 px-2">Документация</h3>
        {loadingDocs ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : docs.length > 0 ? renderTree(docs) : (
            <p className="text-sm text-muted-foreground px-2">Документация не найдена.</p>
        )}
      </div>
    </aside>
  );
}
