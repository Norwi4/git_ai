import { Header } from "@/components/docs/header";
import { DocAiSidebar } from "@/components/docs/doc-ai-sidebar";
import { ChatSidebar } from "@/components/docs/chat-sidebar";
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
      <div className="flex-1 grid grid-cols-[280px_1fr] md:grid-cols-[280px_1fr_350px] overflow-hidden">
        <DocAiSidebar repoId={params.repoId} />
        <main className="flex flex-col overflow-auto">
            {children}
        </main>
        <div className="hidden md:flex">
          <ChatSidebar />
        </div>
      </div>
      <Toaster />
    </div>
  );
}