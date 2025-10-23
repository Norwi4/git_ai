import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
        <div className="flex min-h-screen">
            <MainNav />
            <SidebarInset className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
                {children}
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
