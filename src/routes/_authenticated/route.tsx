import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading, configured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && configured && !user) navigate({ to: "/login", replace: true });
  }, [loading, configured, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (configured && !user) return null;

  return (
    <SidebarProvider>
      <div className="aurora-bg flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
