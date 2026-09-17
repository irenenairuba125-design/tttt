import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hostel Finder Uganda",
  description: "Find and book verified hostels near your university campus",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
            <a href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 text-base font-bold text-white shadow-sm">
                H
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Hostel<span className="text-teal-600">Finder</span>
                <span className="ml-1 text-xs font-semibold text-slate-400">UG</span>
              </span>
            </a>
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
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400 sm:px-6">
            © {new Date().getFullYear()} HostelFinder UG · Find and book verified student hostels near your campus.
          </div>
        </footer>
      </body>
    </html>
  );
}
