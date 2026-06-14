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
      <SidebarInset className="h-screen relative overflow-hidden flex flex-col bg-background dark:bg-black">
        <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 dark:border-neutral-900 justify-between h-14">
          <SidebarTrigger />
        </header>

        <main className="flex-1 overflow-hidden relative">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
