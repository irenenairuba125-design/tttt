import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminHostelActions from "@/components/AdminHostelActions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.role !== "super_admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          This page is only available to super admins.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:text-teal-800">
          ← Back home
        </Link>
      </div>
    );
  }

  const [pendingHostels, approvedCount, pendingCount, rejectedCount, studentCount, bookingCount] =
    await Promise.all([
      prisma.hostel.findMany({
        where: { status: "pending" },
        include: { owner: { select: { name: true, phone: true } }, university: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.hostel.count({ where: { status: "approved" } }),
      prisma.hostel.count({ where: { status: "pending" } }),
      prisma.hostel.count({ where: { status: "rejected" } }),
      prisma.user.count({ where: { role: "student" } }),
      prisma.booking.count(),
    ]);

  const stats = [
    { label: "Pending approval", value: pendingCount, tone: "text-amber-600" },
    { label: "Approved hostels", value: approvedCount, tone: "text-emerald-700" },
    { label: "Rejected hostels", value: rejectedCount, tone: "text-red-600" },
    { label: "Students", value: studentCount, tone: "text-slate-900" },
    { label: "Bookings", value: bookingCount, tone: "text-slate-900" },
  ];

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
          <p className="text-sm text-slate-500">Review and approve hostel listings before they go live.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className={`text-2xl font-bold ${s.tone}`}>{s.value}</div>
              <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-bold text-slate-900">
          Pending hostels ({pendingHostels.length})
        </h2>

        <div className="mt-4 space-y-3">
          {pendingHostels.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
              No hostels waiting for approval.
            </div>
          )}
          {pendingHostels.map((h) => (
            <div key={h.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {h.photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.photos[0]} alt={h.hostelName} className="h-24 w-28 flex-none rounded-xl object-cover" />
              ) : (
                <div className="h-24 w-28 flex-none rounded-xl bg-slate-100" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{h.hostelName}</div>
                    <div className="text-xs text-slate-500">
                      {h.university.name} · {h.addressText}
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-700">
                    {h.type.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-1.5 text-sm text-slate-600">
                  UGX {h.priceRangeMin.toLocaleString()} – {h.priceRangeMax.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Submitted by {h.owner.name} ({h.owner.phone}) · {h.createdAt.toLocaleDateString()}
                </div>
                <div className="mt-3 max-w-xs">
                  <AdminHostelActions hostelId={h.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
