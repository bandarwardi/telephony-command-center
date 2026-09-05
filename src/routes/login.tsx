import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LockKeyhole, Radar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FirebaseNotice } from "@/components/firebase-notice";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — CodeLookup" },
      { name: "description", content: "Sign in to the CodeLookup telecom admin console." },
      { property: "og:title", content: "Admin Login — CodeLookup" },
      { property: "og:description", content: "Secure sign-in for CodeLookup administrators." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back");
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="aurora-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Radar className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold">CodeLookup Admin</h1>
            <p className="text-sm text-muted-foreground">Telecom & area code intelligence</p>
          </div>
        </div>

        <FirebaseNotice />

        <form onSubmit={onSubmit} className="glass-panel space-y-4 rounded-2xl p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@codelookup.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <LockKeyhole className="mr-2 size-4" />
            )}
            Sign in
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Email/password accounts are managed in Firebase Authentication.
          </p>
        </form>
      </div>
    </main>
  );
}
