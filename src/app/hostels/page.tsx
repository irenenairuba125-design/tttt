import BrowseHostels from "@/components/BrowseHostels";

export default function HostelsPage() {
  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-900">All available hostels</h1>
          <p className="text-sm text-slate-500">
            Browse every approved hostel, or narrow it down by university, gender and price.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BrowseHostels />
      </div>
    </div>
  );
}
