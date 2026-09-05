import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, Plus, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FirebaseNotice } from "@/components/firebase-notice";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  createAreaCode,
  deleteAreaCode,
  listAreaCodes,
  updateAreaCode,
  type AreaCode,
} from "@/lib/collections";

export const Route = createFileRoute("/_authenticated/area-codes")({
  head: () => ({
    meta: [
      { title: "Area Codes — CodeLookup Admin" },
      {
        name: "description",
        content: "Add, edit and flag telephone area codes with carrier, timezone and scam data.",
      },
      { property: "og:title", content: "Area Codes — CodeLookup Admin" },
      { property: "og:description", content: "Manage area code records and high-risk scam flags." },
    ],
  }),
  component: AreaCodesPage,
});

const empty: Omit<AreaCode, "id"> = {
  code: "",
  city: "",
  state: "",
  country: "US",
  timezone: "Eastern (EDT)",
  carrier: "",
  isScam: false,
};

const timezones = [
  "Eastern (EDT)",
  "Central (CDT)",
  "Mountain (MDT)",
  "Pacific (PDT)",
  "Alaska (AKDT)",
  "Hawaii (HST)",
  "Atlantic (AST)",
];

function AreaCodesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["areaCodes"],
    queryFn: listAreaCodes,
    enabled: isFirebaseConfigured,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editingId) await updateAreaCode(editingId, form);
      else await createAreaCode(form);
    },
    onSuccess: () => {
      toast.success(editingId ? "Area code updated" : "Area code added");
      queryClient.invalidateQueries({ queryKey: ["areaCodes"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: deleteAreaCode,
    onSuccess: () => {
      toast.success("Area code deleted");
      queryClient.invalidateQueries({ queryKey: ["areaCodes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item: AreaCode) {
    const { id, ...rest } = item;
    setEditingId(id);
    setForm({ ...empty, ...rest });
    setOpen(true);
  }

  const filtered = data.filter((a) =>
    [a.code, a.city, a.state, a.country].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <FirebaseNotice />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Area Codes</h1>
          <p className="text-sm text-muted-foreground">
            Coverage data, carriers and high-risk scam flags.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, city, state…"
            className="w-56"
          />
          <Button onClick={openNew}>
            <Plus className="mr-2 size-4" /> Add area code
          </Button>
        </div>
      </div>

      <Card className="glass-panel overflow-hidden border-0 py-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading area codes…
            </div>
          ) : error ? (
            <p className="p-10 text-center text-sm text-destructive">{(error as Error).message}</p>
          ) : filtered.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No area codes yet. Add your first record.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.state}</TableCell>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.timezone}</TableCell>
                    <TableCell className="text-muted-foreground">{item.carrier || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={item.isScam ? "destructive" : "secondary"}>
                        {item.isScam ? (
                          <ShieldAlert className="mr-1 size-3" />
                        ) : (
                          <ShieldCheck className="mr-1 size-3" />
                        )}
                        {item.isScam ? "Scam" : "Safe"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove.mutate(item.id)}
                        disabled={remove.isPending}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit area code" : "Add area code"}</DialogTitle>
            <DialogDescription>Stored in the Firestore areaCodes collection.</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="212"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Region / City</Label>
              <Input
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="New York City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={form.country}
                onValueChange={(v) => setForm({ ...form, country: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Caribbean">Caribbean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={form.timezone}
                onValueChange={(v) => setForm({ ...form, timezone: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier information</Label>
              <Input
                id="carrier"
                value={form.carrier}
                onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                placeholder="Verizon Wireless"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/70 p-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">High-risk / scam number</p>
                <p className="text-xs text-muted-foreground">
                  Highlights Wangiri and premium-rate Caribbean ranges.
                </p>
              </div>
              <Switch
                checked={form.isScam}
                onCheckedChange={(v) => setForm({ ...form, isScam: v })}
              />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
