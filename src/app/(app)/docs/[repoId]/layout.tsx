import { Header } from "@/components/docs/header";
import { DocAiSidebar } from "@/components/docs/doc-ai-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { repoId: string };
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header repoId={params.repoId} />
      <div className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        <DocAiSidebar repoId={params.repoId} />
        <main className="flex flex-col overflow-auto">
            {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
