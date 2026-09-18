import { notFound } from "next/navigation";
import Link from "next/link";
import { hostels, rooms, amenities, reviews, bookings, universities } from "@/lib/store";
import { getSession } from "@/lib/auth";
import RoomBookButton from "@/components/RoomBookButton";
import ReviewForm from "@/components/ReviewForm";
import IssueForm from "@/components/IssueForm";

const TYPE_BADGE: Record<string, string> = {
  girls_only: "bg-pink-50 text-pink-700 ring-pink-200",
  boys_only: "bg-blue-50 text-blue-700 ring-blue-200",
  mixed: "bg-teal-50 text-teal-700 ring-teal-200",
};

const TYPE_LABEL: Record<string, string> = {
  girls_only: "Girls Only",
  boys_only: "Boys Only",
  mixed: "Mixed",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function HostelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const hostelBase = hostels.find((h) => h.id === id);
  if (!hostelBase || hostelBase.status !== "approved") notFound();

  const hostel = {
    ...hostelBase,
    rooms: rooms.filter((r) => r.hostelId === id).sort((a, b) => a.roomNo.localeCompare(b.roomNo)),
    amenities: hostelBase.amenityIds.map((amenityId) => ({
      amenityId,
      amenity: amenities.find((a) => a.id === amenityId)!,
    })),
    reviews: reviews
      .filter((r) => r.hostelId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((r) => ({ ...r, student: { name: r.studentName } })),
    university: universities.find((u) => u.id === hostelBase.universityId)!,
  };

  const session = await getSession();
  let caretakerPhone: string | null = null;
  let canReview = false;

  if (session) {
    const unlockedBooking = bookings.find(
      (b) =>
        b.hostelId === id &&
        b.studentId === session.userId &&
        ["paid", "reserved", "checked_in", "checked_out"].includes(b.status)
    );
    if (unlockedBooking) {
      caretakerPhone = hostel.caretakerPhone;
      canReview = true;
    }
  }

  const photos = hostel.photos;
  const avgRating =
    hostel.reviews.length > 0
      ? hostel.reviews.reduce((s, r) => s + r.rating, 0) / hostel.reviews.length
      : hostel.rating;

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Link
            href={`/university/${hostel.universityId}`}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Back to {hostel.university.name} hostels
          </Link>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
          <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl sm:h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[0]}
              alt={hostel.hostelName}
              className="col-span-2 h-48 w-full object-cover sm:h-full"
            />
            <div className="grid gap-2">
              {photos.slice(1, 3).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${hostel.hostelName} photo ${i + 2}`}
                  className="h-[94px] w-full object-cover sm:h-full"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{hostel.hostelName}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.69 18.933a.75.75 0 0 0 .62 0c.058-.026 5.15-2.417 7.375-6.68A8.968 8.968 0 0 0 19 8a9 9 0 0 0-18 0c0 1.526.44 3.02 1.315 4.253 2.225 4.263 7.317 6.654 7.375 6.68ZM10 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd" />
                  </svg>
                  {hostel.university.name}
                  {hostel.distanceFromGateM ? ` · ${hostel.distanceFromGateM}m from gate` : ""}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-600">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 0 0-.363 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 0 0-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 0 0-.363-1.118l-3.37-2.448c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.958Z" />
                  </svg>
                  {avgRating.toFixed(1)} · {hostel.reviews.length} review{hostel.reviews.length === 1 ? "" : "s"}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${TYPE_BADGE[hostel.type] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}
              >
                {TYPE_LABEL[hostel.type] ?? hostel.type}
              </span>
            </div>

            <p className="mt-5 leading-relaxed text-slate-600">{hostel.description}</p>

            {hostel.amenities.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {hostel.amenities.map((a) => (
                  <span
                    key={a.amenityId}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {a.amenity.name}
                  </span>
                ))}
              </div>
            )}

            {hostel.rules && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">House rules</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {hostel.rules}
                </p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">Rooms</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {hostel.rooms.map((room) => (
                  <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900">
                        Room {room.roomNo} <span className="text-slate-400">·</span>{" "}
                        <span className="capitalize">{room.roomType}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          room.bedsAvailable > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {room.bedsAvailable}/{room.totalBeds} beds free
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm text-slate-500">
                      {room.pricePerSemester ? `UGX ${room.pricePerSemester.toLocaleString()}/semester` : ""}
                      {room.pricePerMonth ? ` · UGX ${room.pricePerMonth.toLocaleString()}/month` : ""}
                    </div>
                    <RoomBookButton roomId={room.id} disabled={room.bedsAvailable < 1} isLoggedIn={!!session} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold text-slate-900">Reviews ({hostel.reviews.length})</h2>
              {canReview && <ReviewForm hostelId={hostel.id} />}
              <div className="mt-4 space-y-3">
                {hostel.reviews.map((r) => (
                  <div key={r.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                      {initials(r.student.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{r.student.name}</span>
                        <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      </div>
                      {r.comment && <p className="mt-1 text-sm text-slate-600">{r.comment}</p>}
                    </div>
                  </div>
                ))}
                {hostel.reviews.length === 0 && (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Caretaker contact</div>
              {caretakerPhone ? (
                <p className="mt-1.5 flex items-center gap-1.5 font-semibold text-teal-700">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-.464 1.442l-.383.383a.5.5 0 0 0-.11.55c.567 1.32 1.542 2.32 2.87 2.87a.5.5 0 0 0 .55-.11l.383-.383a1.5 1.5 0 0 1 1.442-.464l3.223.716a1.5 1.5 0 0 1 1.175 1.465V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-7.18 0-13-5.82-13-13v-1Z" />
                  </svg>
                  {caretakerPhone}
                </p>
              ) : (
                <p className="mt-1.5 text-sm text-slate-500">
                  Pay the booking fee to unlock the caretaker&apos;s phone number.
                </p>
              )}
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                A UGX 50,000 booking fee reserves your room for 48 hours while you arrange move-in.
              </div>
              {canReview && <IssueForm hostelId={hostel.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
