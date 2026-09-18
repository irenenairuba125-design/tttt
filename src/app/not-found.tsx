import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-2xl font-bold text-white shadow-sm">
        H
      </span>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate-500">
        The hostel, university, or booking you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
      >
        Back to home
      </Link>
    </div>
  );
}
