import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export function AdminHeader() {
  const { email, signOutUser } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOutUser();
    toast.success("Signed out");
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl">
      <SidebarTrigger />
      <div className="flex-1">
        <p className="font-display text-sm font-semibold">Telecom Intelligence Admin</p>
        <p className="text-xs text-muted-foreground">Area codes, content and site configuration</p>
      </div>
      <span className="hidden rounded-full border border-border/70 bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground sm:inline">
        {email ?? "not signed in"}
      </span>
      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        <LogOut className="mr-2 size-4" />
        Logout
      </Button>
    </header>
  );
}
