import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const searchSchema = z.object({ room: z.string().optional() });

type Room = {
  id: string;
  slug: string;
  name: string;
  price_per_night: number;
  capacity: number;
};

const roomsQuery = queryOptions({
  queryKey: ["rooms", "booking"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, slug, name, price_per_night, capacity")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data as Room[];
  },
});

export const Route = createFileRoute("/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Reserve — Mimi Hotels" },
      { name: "description", content: "Reserve your suite at Mimi Hotels, Jalalabad. Instant booking confirmation." },
      { property: "og:title", content: "Reserve — Mimi Hotels" },
      { property: "og:description", content: "Instant booking with confirmation." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(roomsQuery); },
  component: BookingPage,
});

const formSchema = z.object({
  guest_name: z.string().trim().min(2, "Please enter your full name").max(100),
  guest_email: z.string().trim().email("Invalid email").max(255),
  guest_phone: z.string().trim().min(6, "Enter a valid phone").max(24),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  guests: z.number().int().min(1).max(10),
  room_id: z.string().uuid(),
  special_requests: z.string().max(600).optional(),
});

function BookingPage() {
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  const search = Route.useSearch();
  const initialRoom = rooms.find((r) => r.slug === search.room) ?? rooms[0];

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    room_id: initialRoom.id,
    check_in: today,
    check_out: tomorrow,
    guests: 2,
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    special_requests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ code: string; total: number } | null>(null);

  const selectedRoom = rooms.find((r) => r.id === form.room_id) ?? rooms[0];
  const nights = useMemo(() => {
    const a = new Date(form.check_in).getTime();
    const b = new Date(form.check_out).getTime();
    return Math.max(1, Math.round((b - a) / 86400000));
  }, [form.check_in, form.check_out]);
  const total = nights * Number(selectedRoom.price_per_night);

  const submit = async () => {
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid form");
      return;
    }
    if (new Date(form.check_out) <= new Date(form.check_in)) {
      toast.error("Check-out must be after check-in");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase
      .from("bookings")
      .insert({ ...parsed.data, total_amount: total })
      .select("booking_code")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setConfirmation({ code: data.booking_code, total });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-40 pb-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center">
            <p className="eyebrow">Reserve</p>
            <h1 className="mt-6 font-display text-5xl text-ivory md:text-7xl">
              Your stay, <em className="gradient-ember not-italic">planned</em> in three moves.
            </h1>
          </div>

          <div className="mx-auto mt-16 flex max-w-md items-center justify-between">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-1 items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border font-display text-lg transition-all duration-500 ${
                    step >= n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {n}
                </div>
                {n < 3 && (
                  <div className={`mx-3 h-px flex-1 transition-all duration-500 ${step > n ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 glass-card rounded-lg p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-display text-3xl text-ivory">Your dates & suite</h2>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Field label="Check-in">
                      <input
                        type="date"
                        min={today}
                        value={form.check_in}
                        onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Check-out">
                      <input
                        type="date"
                        min={form.check_in}
                        value={form.check_out}
                        onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Guests">
                      <input
                        type="number"
                        min={1}
                        max={selectedRoom.capacity}
                        value={form.guests}
                        onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Suite">
                      <select
                        value={form.room_id}
                        onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                        className={inputCls}
                      >
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} — ₹{Number(r.price_per_night).toLocaleString("en-IN")}/night
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Summary nights={nights} total={total} roomName={selectedRoom.name} />

                  <div className="mt-8 flex justify-end">
                    <button onClick={() => setStep(2)} className="btn-lux btn-lux-primary">
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-display text-3xl text-ivory">Your details</h2>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Field label="Full name">
                      <input value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Phone (WhatsApp)" className="md:col-span-2">
                      <input value={form.guest_phone} onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} className={inputCls} placeholder="+91 ..." />
                    </Field>
                    <Field label="Special requests" className="md:col-span-2">
                      <textarea rows={4} value={form.special_requests} onChange={(e) => setForm({ ...form, special_requests: e.target.value })} className={inputCls + " resize-none"} placeholder="Anniversary, floor preference, dietary notes…" />
                    </Field>
                  </div>

                  <Summary nights={nights} total={total} roomName={selectedRoom.name} />

                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(1)} className="btn-lux">← Back</button>
                    <button onClick={submit} disabled={submitting} className="btn-lux btn-lux-primary">
                      {submitting ? "Reserving…" : "Confirm reservation →"}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && confirmation && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary shadow-glow">
                    <span className="text-3xl text-primary">✦</span>
                  </div>
                  <p className="eyebrow mt-8">Reservation confirmed</p>
                  <h2 className="mt-4 font-display text-5xl text-ivory">
                    We'll see you soon.
                  </h2>
                  <p className="mt-6 text-foreground/70">
                    Your booking reference
                  </p>
                  <p className="mt-2 font-display text-4xl text-primary tracking-widest">
                    {confirmation.code}
                  </p>
                  <p className="mt-6 text-sm text-muted-foreground">
                    A confirmation has been recorded. Our reservations team
                    will reach out on your phone shortly.
                  </p>
                  <div className="mt-10 flex justify-center gap-3">
                    <Link to="/" className="btn-lux">Return home</Link>
                    <Link to="/rooms" className="btn-lux btn-lux-primary">Explore more</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const inputCls =
  "w-full rounded-sm border border-border bg-input/40 px-4 py-3 text-sm text-ivory outline-none transition-all focus:border-primary focus:bg-input/70";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Summary({ nights, total, roomName }: { nights: number; total: number; roomName: string }) {
  return (
    <div className="mt-10 flex items-end justify-between border-t border-border/50 pt-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Selected</p>
        <p className="mt-1 font-display text-2xl text-ivory">{roomName}</p>
        <p className="mt-1 text-sm text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Total</p>
        <p className="mt-1 font-display text-4xl text-primary">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
