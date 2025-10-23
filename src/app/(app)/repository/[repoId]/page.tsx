import { notFound } from "next/navigation";
import { repositories, files, commits, branches } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GitBranch, Code, FileCode, History, GitMerge } from "lucide-react";
import { FileBrowser } from "@/components/repository/file-browser";
import { CommitList } from "@/components/repository/commit-list";
import { BranchList } from "@/components/repository/branch-list";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function RepositoryPage({ params }: { params: { repoId: string } }) {
  const repo = repositories.find((r) => r.id === params.repoId);

  if (!repo) {
    notFound();
  }

  const defaultBranch = branches.find(b => b.isDefault)?.name || 'main';

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title={repo.name}
        description={repo.description}
      >
        <div className="flex items-center gap-2">
            <Select defaultValue={defaultBranch}>
                <SelectTrigger className="w-auto gap-2">
                    <GitBranch className="h-4 w-4" />
                    <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                    {branches.map(branch => (
                        <SelectItem key={branch.name} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline">
                <Code className="mr-2 h-4 w-4" />
                Clone
            </Button>
        </div>
      </PageHeader>
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="files"><FileCode className="mr-2"/>Files</TabsTrigger>
          <TabsTrigger value="commits"><History className="mr-2"/>Commits</TabsTrigger>
          <TabsTrigger value="branches"><GitMerge className="mr-2"/>Branches</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="mt-4">
          <FileBrowser files={files} />
        </TabsContent>
        <TabsContent value="commits" className="mt-4">
          <CommitList commits={commits} />
        </TabsContent>
        <TabsContent value="branches" className="mt-4">
          <BranchList branches={branches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
