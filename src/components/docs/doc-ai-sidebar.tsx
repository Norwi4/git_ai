"use client";
import { useState, useEffect } from "react";
import { File, Folder, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mockApiDocs = [
  { name: "architecture.md", path: "doc_ai/architecture.md", type: 'file' as const },
  { name: "api_overview.md", path: "doc_ai/api_overview.md", type: 'file' as const },
  { name: "getting-started", path: "doc_ai/getting-started", type: 'folder' as const, children: [
    { name: "installation.md", path: "doc_ai/getting-started/installation.md", type: 'file' as const },
    { name: "configuration.md", path: "doc_ai/getting-started/configuration.md", type: 'file' as const },
  ]},
];

type DocEntry = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: DocEntry[];
};

export function DocAiSidebar({ repoId }: { repoId: string }) {
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
      setLoading(true);
      // In a real app: fetch(`/api/repos/${repoId}/doc_ai`)
      setTimeout(() => {
          setDocs(mockApiDocs);
          setLoading(false);
      }, 1000);
  }, [repoId]);

  const renderTree = (nodes: DocEntry[]) => {
    const filteredNodes = nodes.filter(node => node.name.toLowerCase().includes(search.toLowerCase()));
    
    return (
        <ul className="space-y-1">
            {filteredNodes.map((node, index) => (
                <li key={index}>
                    {node.type === 'folder' ? (
                        <div>
                            <div className="flex items-center gap-2 text-sm font-medium p-2 rounded-md">
                                <Folder className="h-4 w-4" />
                                <span>{node.name}</span>
                            </div>
                            <div className="pl-4">
                                {node.children && renderTree(node.children)}
                            </div>
                        </div>
                    ) : (
                        <Link href={`/docs/${repoId}/${node.path.replace('doc_ai/','')}`} className={cn(
                            "flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted",
                            pathname === `/docs/${repoId}/${node.path.replace('doc_ai/','')}` && "bg-muted font-semibold"
                        )}>
                            <File className="h-4 w-4" />
                            <span>{node.name}</span>
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
  };
  
  return (
    <aside className="border-r bg-background flex flex-col">
      <div className="p-4 space-y-4 border-b">
        <h2 className="text-lg font-semibold font-headline">Документация проекта</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск по имени файла" 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : renderTree(docs)}
      </div>
    </aside>
  );
}