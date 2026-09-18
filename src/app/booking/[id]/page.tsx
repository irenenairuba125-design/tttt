import { notFound, redirect } from "next/navigation";
import { bookings, hostels, rooms, payments } from "@/lib/store";
import { getSession } from "@/lib/auth";
import PayMomoButton from "@/components/PayMomoButton";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const bookingBase = bookings.find((b) => b.id === id);

  if (!bookingBase || bookingBase.studentId !== session.userId) notFound();

  const booking = {
    ...bookingBase,
    hostel: hostels.find((h) => h.id === bookingBase.hostelId)!,
    room: rooms.find((r) => r.id === bookingBase.roomId)!,
    payments: payments.filter((p) => p.bookingId === bookingBase.id),
  };

  const unlocked = ["paid", "reserved", "checked_in"].includes(booking.status);
  const successfulPayment = booking.payments.find((p) => p.status === "success");
  const photo = booking.hostel.photos[0];

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-slate-900">Booking confirmation</h1>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={booking.hostel.hostelName} className="h-36 w-full object-cover" />
          )}
          <div className="p-5">
            <div className="text-lg font-semibold text-slate-900">{booking.hostel.hostelName}</div>
            <div className="text-sm text-slate-500">
              Room {booking.room.roomNo} · <span className="capitalize">{booking.room.roomType}</span>
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking fee</span>
                <span className="font-semibold text-slate-900">
                  UGX {booking.bookingFeeAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-700">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!unlocked && (
          <div className="mt-6">
            <PayMomoButton bookingId={booking.id} />
            <p className="mt-2 text-center text-xs text-slate-400">
              This is a simulated MTN MoMo payment for demo purposes — no real money is charged.
            </p>
          </div>
        )}

        {unlocked && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 font-semibold text-emerald-800">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              Room reserved!
            </div>
            <p className="mt-1 text-sm text-emerald-700">
              Your room is held for 48 hours from payment. Contact the caretaker to arrange check-in.
            </p>
            <div className="mt-4 space-y-1.5 rounded-xl bg-white/60 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Caretaker phone</span>
                <span className="font-semibold text-slate-900">{booking.hostel.caretakerPhone}</span>
              </div>
              {successfulPayment?.momoTxnId && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Receipt / MoMo txn ID</span>
                  <span className="font-mono text-xs text-slate-900">{successfulPayment.momoTxnId}</span>
                </div>
              )}
              {booking.reservedUntil && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Reserved until</span>
                  <span className="font-semibold text-slate-900">
                    {booking.reservedUntil.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
