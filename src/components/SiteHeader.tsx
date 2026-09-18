"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Session = { userId: string; role: string; name: string } | null;

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setSession(data.user))
      .finally(() => setLoaded(true));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function initials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 text-base font-bold text-white shadow-sm">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Hostel<span className="text-teal-600">Finder</span>
            <span className="ml-1 text-xs font-semibold text-slate-400">UG</span>
          </span>
        </Link>

        {!loaded ? (
          <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
        ) : session ? (
          <nav className="flex items-center gap-1 text-sm font-medium">
            <a
              href="/bookings"
              className="rounded-lg px-3.5 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              My Bookings
            </a>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  {initials(session.name)}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
                    Signed in as <span className="font-medium text-slate-700">{session.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-sm font-medium">
            <a
              href="/login"
              className="rounded-lg px-3.5 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Login
            </a>
            <a
              href="/register"
              className="rounded-lg bg-teal-700 px-3.5 py-2 text-white shadow-sm transition hover:bg-teal-800"
            >
              Register
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
