import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, PhoneCall, Search, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FirebaseNotice } from "@/components/firebase-notice";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CodeLookup Admin" },
      { name: "description", content: "Overview of area code data, lookups and content activity." },
      { property: "og:title", content: "Dashboard — CodeLookup Admin" },
      { property: "og:description", content: "Live overview of your telecom lookup platform." },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Total Area Codes", value: "1,284", delta: "+18 this month", icon: PhoneCall },
  { label: "Total Articles", value: "96", delta: "7 drafts pending", icon: FileText },
  { label: "Total Lookups", value: "342,908", delta: "+12.4% vs last week", icon: Search },
  { label: "Active Users", value: "8,412", delta: "+642 new", icon: Users },
];

const lookupTrend = [
  { day: "Mon", lookups: 38200 },
  { day: "Tue", lookups: 41100 },
  { day: "Wed", lookups: 46850 },
  { day: "Thu", lookups: 44120 },
  { day: "Fri", lookups: 52340 },
  { day: "Sat", lookups: 47010 },
  { day: "Sun", lookups: 49280 },
];

const activity = [
  { code: "212", city: "New York City", action: "Scam flag removed", time: "6 min ago", risk: "Safe" },
  { code: "876", city: "Kingston, JM", action: "Marked as Wangiri risk", time: "24 min ago", risk: "Scam" },
  { code: "416", city: "Toronto, ON", action: "Carrier updated", time: "1 hr ago", risk: "Safe" },
  { code: "473", city: "Grenada", action: "New area code added", time: "3 hrs ago", risk: "Scam" },
  { code: "305", city: "Miami, FL", action: "Timezone corrected", time: "5 hrs ago", risk: "Safe" },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <FirebaseNotice />

      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Snapshot of lookups, coverage and editorial activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-panel border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="glass-panel border-0 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" /> Lookups this week
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lookupTrend}>
                <defs>
                  <linearGradient id="lookupFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={48} />
                <ReTooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="lookups"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#lookupFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((a) => (
                  <TableRow key={a.code}>
                    <TableCell>
                      <p className="font-medium">{a.code}</p>
                      <p className="text-xs text-muted-foreground">{a.city}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={a.risk === "Scam" ? "destructive" : "secondary"}>
                        {a.risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
