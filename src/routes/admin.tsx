import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/RevealSection";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Mimi Hotels" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Admin dashboard for Mimi Hotels." },
    ],
  }),
  component: AdminPage,
});

type Booking = {
  id: string; booking_code: string; guest_name: string; guest_email: string;
  guest_phone: string; check_in: string; check_out: string; guests: number;
  total_amount: number; status: string; created_at: string;
  rooms: { name: string } | null;
};

function AdminPage() {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (!data.session) { nav({ to: "/auth" }); return; }
      setUserId(data.session.user.id);
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      setIsAdmin(!!role);
    });
    return () => { mounted = false; };
  }, [nav]);

  const { data: bookings, refetch } = useQuery({
    queryKey: ["admin-bookings"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, rooms(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
  });

  if (isAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Verifying…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="flex min-h-screen items-center justify-center px-6 pt-32 text-center">
          <div className="glass-card max-w-md rounded-lg p-10">
            <p className="eyebrow">Restricted</p>
            <h1 className="mt-4 font-display text-3xl text-ivory">Admin access required</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Your account doesn't have admin privileges. If you're the property
              owner, ask a workspace admin to grant you the <code className="text-primary">admin</code> role
              in the <code className="text-primary">user_roles</code> table.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Signed in as: {userId}</p>
            <Link to="/" className="btn-lux btn-lux-primary mt-8 inline-flex">Return home</Link>
          </div>
        </main>
      </div>
    );
  }

  const total = bookings?.length ?? 0;
  const revenue = bookings?.reduce((a, b) => a + Number(b.total_amount), 0) ?? 0;
  const confirmed = bookings?.filter((b) => b.status === "confirmed").length ?? 0;
  const pending = bookings?.filter((b) => b.status === "pending").length ?? 0;

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <Reveal>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-4 font-display text-5xl text-ivory md:text-6xl">Operations</h1>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Stat label="Total bookings" value={total.toString()} />
            <Stat label="Confirmed" value={confirmed.toString()} accent />
            <Stat label="Pending" value={pending.toString()} />
            <Stat label="Revenue" value={`₹${(revenue / 1000).toFixed(1)}k`} accent />
          </div>

          <Reveal className="mt-16">
            <div className="glass-card overflow-hidden rounded-lg">
              <div className="border-b border-border/40 p-6">
                <h2 className="font-display text-2xl text-ivory">Recent reservations</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/40 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <tr>
                      <th className="p-4 text-left">Code</th>
                      <th className="p-4 text-left">Guest</th>
                      <th className="p-4 text-left">Suite</th>
                      <th className="p-4 text-left">Dates</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings?.map((b) => (
                      <tr key={b.id} className="border-b border-border/20 transition-colors hover:bg-primary/5">
                        <td className="p-4 font-mono text-xs text-primary">{b.booking_code}</td>
                        <td className="p-4">
                          <div className="text-ivory">{b.guest_name}</div>
                          <div className="text-xs text-muted-foreground">{b.guest_email}</div>
                        </td>
                        <td className="p-4 text-foreground/80">{b.rooms?.name ?? "—"}</td>
                        <td className="p-4 text-xs text-foreground/70">
                          {b.check_in} → {b.check_out}
                        </td>
                        <td className="p-4 text-right font-display text-lg text-ivory">
                          ₹{Number(b.total_amount).toLocaleString("en-IN")}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="p-4 text-right">
                          {b.status === "pending" && (
                            <button
                              onClick={() => setStatus(b.id, "confirmed")}
                              className="text-xs uppercase tracking-[0.2em] text-primary hover:underline"
                            >Confirm</button>
                          )}
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => setStatus(b.id, "completed")}
                              className="text-xs uppercase tracking-[0.2em] text-primary hover:underline"
                            >Complete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!bookings?.length && (
                      <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">No bookings yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card relative overflow-hidden rounded-lg p-6"
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className={`mt-3 font-display text-5xl ${accent ? "gradient-ember" : "text-ivory"}`}>{value}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-accent/20 text-accent border-accent/40",
    confirmed: "bg-primary/20 text-primary border-primary/40",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-destructive/20 text-destructive border-destructive/40",
  };
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
