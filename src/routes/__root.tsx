import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-6xl text-ivory">Lost in the corridors</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you seek has slipped behind a curtain.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-lux btn-lux-primary">Return to the lobby</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Interruption</p>
        <h1 className="mt-4 font-display text-4xl text-ivory">A moment, please</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something didn't load as we intended.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-lux btn-lux-primary"
          >Try again</button>
          <a href="/" className="btn-lux">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mimi Hotels — Timeless luxury in Jalalabad" },
      {
        name: "description",
        content:
          "A cinematic sanctuary in Shahjahanpur, Uttar Pradesh. Suites, dining, and celebrations, all shaped by unhurried hospitality.",
      },
      { name: "author", content: "Mimi Hotels" },
      { property: "og:title", content: "Mimi Hotels — Timeless luxury in Jalalabad" },
      {
        property: "og:description",
        content:
          "A cinematic sanctuary in Shahjahanpur, Uttar Pradesh. Suites, dining, and celebrations, all shaped by unhurried hospitality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mimi Hotels — Timeless luxury in Jalalabad" },
      { name: "twitter:description", content: "A cinematic sanctuary in Shahjahanpur, Uttar Pradesh. Suites, dining, and celebrations, all shaped by unhurried hospitality." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/29a1c3d8-7868-4eab-938f-23659307a387" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/29a1c3d8-7868-4eab-938f-23659307a387" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      <Cursor />
      <Outlet />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "oklch(0.16 0.014 60)", color: "oklch(0.94 0.018 80)", border: "1px solid oklch(0.74 0.11 75 / 0.3)" } }} />
    </QueryClientProvider>
  );
}
