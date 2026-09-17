export type HostelListItem = {
  id: string;
  hostelName: string;
  type: "girls_only" | "boys_only" | "mixed";
  locationLat: number;
  locationLng: number;
  distanceFromGateM: number | null;
  addressText: string | null;
  description: string | null;
  priceRangeMin: number;
  priceRangeMax: number;
  rating: number;
  photos: string[];
  rooms: {
    id: string;
    roomType: "single" | "double" | "triple";
    bedsAvailable: number;
    pricePerSemester: number | null;
    pricePerMonth: number | null;
    status: string;
  }[];
  amenities: { amenity: { id: string; name: string } }[];
  _count: { reviews: number };
};
