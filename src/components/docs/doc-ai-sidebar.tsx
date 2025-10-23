"use client";
import { useState, useEffect } from "react";
import { File, Folder, Loader2, ChevronRight, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Repository } from "@/lib/types";

type DocEntry = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: DocEntry[];
};

export function DocAiSidebar({ repoId }: { repoId: string }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [docsByRepo, setDocsByRepo] = useState<Record<string, DocEntry[]>>({});
  const [loadingDocs, setLoadingDocs] = useState<Record<string, boolean>>({});
  const [expandedRepos, setExpandedRepos] = useState<string[]>([]);
  const pathname = usePathname();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!apiBaseUrl) return;
    setLoadingRepos(true);
    fetch(`${apiBaseUrl}/api/repos`)
      .then(res => res.json())
      .then((data: Repository[]) => {
        setRepos(data);
        setLoadingRepos(false);
      })
      .catch(() => {
        setRepos([]);
        setLoadingRepos(false);
      });
  }, [apiBaseUrl]);
  
  useEffect(() => {
    const storedState = localStorage.getItem(`expandedRepos`);
    if (storedState) {
        setExpandedRepos(JSON.parse(storedState));
    }
    if (repoId) {
        setExpandedRepos(prev => [...new Set([...prev, repoId])]);
        fetchDocs(repoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoId]);

  const fetchDocs = (id: string) => {
    if (!apiBaseUrl || docsByRepo[id]) return;
    setLoadingDocs(prev => ({ ...prev, [id]: true }));
    fetch(`${apiBaseUrl}/api/repos/${id}/doc_ai`)
      .then(res => res.json())
      .then((data: {name: string, path: string}[]) => {
        const fileStructure = data.map(file => ({
            ...file,
            type: 'file' as const
        }));
        setDocsByRepo(prev => ({ ...prev, [id]: fileStructure }));
      })
      .catch(() => {
        setDocsByRepo(prev => ({...prev, [id]: []}))
      })
      .finally(() => {
        setLoadingDocs(prev => ({ ...prev, [id]: false }));
      });
  };

  const toggleRepo = (id: string) => {
    const newExpandedRepos = expandedRepos.includes(id)
      ? expandedRepos.filter(p => p !== id)
      : [...expandedRepos, id];
    setExpandedRepos(newExpandedRepos);
    localStorage.setItem(`expandedRepos`, JSON.stringify(newExpandedRepos));
    
    if (newExpandedRepos.includes(id)) {
        fetchDocs(id);
    }
  };


  const renderDocsTree = (nodes: DocEntry[], currentRepoId: string) => {
    return (
        <ul className="space-y-1">
            {nodes.map((node, index) => {
                return (
                    <li key={index}>
                        <Link href={`/docs/${currentRepoId}/${node.path.replace('doc_ai/','')}`} className={cn(
                            "flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted ml-4",
                            pathname === `/docs/${currentRepoId}/${node.path.replace('doc_ai/','')}` && "bg-muted font-semibold"
                        )}>
                            <File className="h-4 w-4 ml-2" />
                            <span>{node.name}</span>
                        </Link>
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
      </div>
      <div className="flex-1 overflow-auto p-4">
        {loadingRepos ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <ul className="space-y-1">
                {repos.map(repo => {
                    const isExpanded = expandedRepos.includes(repo.id.toString());
                    return (
                        <li key={repo.id}>
                            <Collapsible open={isExpanded} onOpenChange={() => toggleRepo(repo.id.toString())}>
                                <CollapsibleTrigger className="w-full">
                                    <div className={cn(
                                        "flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-muted w-full",
                                        repoId === repo.id.toString() && "bg-muted/50"
                                    )}>
                                        <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                                        <Folder className="h-4 w-4" />
                                        <Link href={`/docs/${repo.id}`} className="w-full text-left" onClick={(e) => e.stopPropagation()}>{repo.name}</Link>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="pl-6">
                                    {loadingDocs[repo.id.toString()] ? (
                                        <div className="flex items-center justify-center p-4">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    ) : docsByRepo[repo.id.toString()] && docsByRepo[repo.id.toString()].length > 0 ? (
                                        renderDocsTree(docsByRepo[repo.id.toString()], repo.id.toString())
                                    ) : (
                                        <p className="text-xs text-muted-foreground p-2 ml-6">Документация не найдена.</p>
                                    )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </li>
                    )
                })}
            </ul>
        )}
      </div>
    </aside>
  );
}
