// dashboard/layout.js
import { AppSidebar } from "@/components/sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden flex flex-col bg-background dark:bg-black">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 dark:border-neutral-900 justify-between">
          <SidebarTrigger />
        </header>

        {/* Removed redundant p-6 and locked height to match the internal flex structure */}
        <main className="flex-1 h-[calc(100vh-3.5rem)] overflow-hidden relative">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
