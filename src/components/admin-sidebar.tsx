import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, HelpCircle, LayoutDashboard, PhoneCall, Settings, Radar } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Area Codes", url: "/area-codes", icon: PhoneCall },
  { title: "Blog / Articles", url: "/articles", icon: FileText },
  { title: "FAQs", url: "/faqs", icon: HelpCircle },
  { title: "Site Settings", url: "/settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Radar className="size-5" />
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">CodeLookup</p>
              <p className="text-xs text-muted-foreground">Admin Console</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
