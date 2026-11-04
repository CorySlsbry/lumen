"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getClientAuth } from "@/lib/auth/firebase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async (idToken: string) => {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    router.push("/dashboard");
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const auth = getClientAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await finish(await cred.user.getIdToken());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const auth = getClientAuth();
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await finish(await cred.user.getIdToken());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-dvh lumen-night text-white px-6 py-16 grid place-items-center">
      <div className="max-w-sm w-full space-y-6">
        <Link href="/" className="flex items-center gap-2 font-semibold mb-8">
          <span className="inline-block h-7 w-7 rounded-full lumen-aurora" />
          Lumen
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back.</h1>
        <p className="text-white/60">Your savings are right where you left them.</p>

        <form onSubmit={handleEmail} className="space-y-3">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white bg-white/10 border-white/20"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-white bg-white/10 border-white/20"
            required
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            Log in
          </Button>
        </form>

        <div className="relative text-center text-xs text-white/40">
          <span className="px-2 bg-transparent">or</span>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleGoogle}
          disabled={busy}
        >
          Continue with Google
        </Button>

        <p className="text-sm text-white/60 text-center">
          New here?{" "}
          <Link href="/onboarding" className="text-white underline">
            Start free
          </Link>
        </p>
      </div>
    </main>
  );
}
