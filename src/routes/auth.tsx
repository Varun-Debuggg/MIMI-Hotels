import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Mimi Hotels" },
      { name: "description", content: "Sign in to manage your reservations at Mimi Hotels." },
      { property: "og:title", content: "Sign in — Mimi Hotels" },
      { property: "og:description", content: "Manage your reservations." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome. Check your email to verify.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      nav({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="flex min-h-screen items-center justify-center px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
          className="glass-card w-full max-w-md rounded-lg p-10"
        >
          <p className="eyebrow">Members</p>
          <h1 className="mt-4 font-display text-4xl text-ivory">
            {mode === "in" ? "Welcome back." : "Create an account."}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "in"
              ? "Sign in to see your reservations."
              : "Register to save your details for future stays."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode === "up" && (
              <input
                required placeholder="Full name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-border bg-input/40 px-4 py-3 text-sm text-ivory outline-none focus:border-primary"
              />
            )}
            <input
              required type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-border bg-input/40 px-4 py-3 text-sm text-ivory outline-none focus:border-primary"
            />
            <input
              required type="password" placeholder="Password" value={password}
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-border bg-input/40 px-4 py-3 text-sm text-ivory outline-none focus:border-primary"
            />

            <button disabled={loading} className="btn-lux btn-lux-primary w-full justify-center">
              {loading ? "…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="mt-6 w-full text-center text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
          >
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
