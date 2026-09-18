import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  reserved: "bg-emerald-50 text-emerald-700",
  checked_in: "bg-teal-50 text-teal-700",
  checked_out: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-600",
  expired: "bg-red-50 text-red-600",
};

export default async function MyBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.userId },
    include: { hostel: true, room: true },
    orderBy: { bookingDate: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">My bookings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track the status of every room you&apos;ve booked or reserved.
      </p>

      <div className="mt-6 space-y-3">
        {bookings.map((b) => {
          const photo = b.hostel.photos[0];
          return (
            <Link
              key={b.id}
              href={`/booking/${b.id}`}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={b.hostel.hostelName} className="h-20 w-24 flex-none rounded-xl object-cover" />
              ) : (
                <div className="h-20 w-24 flex-none rounded-xl bg-slate-100" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-slate-900">{b.hostel.hostelName}</div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[b.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-0.5 text-sm text-slate-500">
                  Room {b.room.roomNo} · <span className="capitalize">{b.room.roomType}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-slate-700">
                  Booking fee: UGX {b.bookingFeeAmount.toLocaleString()}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  Booked {b.bookingDate.toLocaleDateString()}
                  {b.reservedUntil ? ` · Reserved until ${b.reservedUntil.toLocaleString()}` : ""}
                </div>
              </div>
            </Link>
          );
        })}

        {bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
            <p className="text-slate-500">You haven&apos;t booked a room yet.</p>
            <Link href="/" className="mt-2 inline-block text-sm font-medium text-teal-700 hover:text-teal-800">
              Browse universities →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
