import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import UniversityExplorer from "@/components/UniversityExplorer";

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const university = await prisma.university.findUnique({ where: { id } });

  if (!university) notFound();

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800">
            ← All universities
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Hostels near {university.name}</h1>
          <p className="text-sm text-slate-500">{university.district} district</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <UniversityExplorer
          universityId={university.id}
          centerLat={university.mainLat}
          centerLng={university.mainLng}
        />
      </div>
    </div>
  );
}
