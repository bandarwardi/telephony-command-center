import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { getFirebaseAuth, isFirebaseConfigured } from "./firebase";

type AuthState = {
  user: User | null;
  email: string | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      email: user?.email ?? null,
      loading,
      configured: isFirebaseConfigured,
      signIn: async (email, password) => {
        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error(
            "Firebase is not connected yet — add your project keys in src/lib/firebase.ts.",
          );
        }
        await signInWithEmailAndPassword(auth, email, password);
      },
      signOutUser: async () => {
        const auth = getFirebaseAuth();
        if (auth) await signOut(auth);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
