import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { hostels: true } } },
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100 ring-1 ring-white/20">
            Trusted by students across Uganda
          </span>
          <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find a hostel near your campus — and lock it in with a small booking fee
          </h1>
          <p className="mt-4 max-w-lg text-teal-100">
            Browse verified hostels around your university, filter by gender and price, and reserve
            your room in minutes via MTN MoMo.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-bold text-slate-900">Choose your university</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select where you study to see nearby hostels on the map.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {universities.map((uni) => (
            <Link
              key={uni.id}
              href={`/university/${uni.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg"
            >
              <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${uni.id}/640/360`}
                  alt={uni.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-800">
                  {uni._count.hostels} hostel{uni._count.hostels === 1 ? "" : "s"}
                </span>
              </div>
              <div className="p-5">
                <div className="text-lg font-semibold text-slate-900 group-hover:text-teal-700">
                  {uni.name}
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.69 18.933a.75.75 0 0 0 .62 0c.058-.026 5.15-2.417 7.375-6.68A8.968 8.968 0 0 0 19 8a9 9 0 0 0-18 0c0 1.526.44 3.02 1.315 4.253 2.225 4.263 7.317 6.654 7.375 6.68ZM10 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd" />
                  </svg>
                  {uni.district} district
                </div>
              </div>
            </Link>
          ))}
        </div>

        {universities.length === 0 && (
          <p className="mt-8 text-slate-500">
            No universities yet. Run <code className="rounded bg-slate-100 px-1">npx prisma db seed</code> to load sample data.
          </p>
        )}
      </div>
    </div>
  );
}
