import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row bg-amber-200">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
