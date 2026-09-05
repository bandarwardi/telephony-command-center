import { AlertTriangle } from "lucide-react";

import { isFirebaseConfigured } from "@/lib/firebase";

export function FirebaseNotice() {
  if (isFirebaseConfigured) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
      <AlertTriangle className="mt-0.5 size-4 text-warning" />
      <div>
        <p className="font-medium">Firebase keys not added yet</p>
        <p className="text-muted-foreground">
          Everything below is wired to Firebase Auth and Firestore. Paste your project keys in{" "}
          <code className="rounded bg-muted px-1">src/lib/firebase.ts</code> (or set the
          VITE_FIREBASE_* variables) and it goes live instantly.
        </p>
      </div>
    </div>
  );
}
