// In-memory demo data store. Replaces the Prisma/database layer entirely so
// the app runs with zero external dependencies (no Postgres/SQLite needed).
//
// Trade-off: writes (bookings, payments, reviews, issues, new accounts) live
// only in this Node process's memory. They work reliably in local dev and
// within a single warm serverless instance, but won't survive a redeploy or
// necessarily show up on a different serverless instance. Good enough for a
// demo; swap back to a real database (see git history) for production use.

export type Role = "super_admin" | "hostel_owner" | "student";
export type HostelType = "girls_only" | "boys_only" | "mixed";
export type RoomType = "single" | "double" | "triple";
export type BookingStatus =
  | "pending"
  | "paid"
  | "reserved"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "expired";

export interface DemoUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: Role;
  gender?: "male" | "female" | "other";
}

export interface University {
  id: string;
  name: string;
  mainLat: number;
  mainLng: number;
  district: string;
}

export interface Amenity {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNo: string;
  roomType: RoomType;
  totalBeds: number;
  bedsAvailable: number;
  pricePerSemester: number | null;
  pricePerMonth: number | null;
  status: "available" | "full";
}

export interface Hostel {
  id: string;
  ownerId: string;
  universityId: string;
  hostelName: string;
  type: HostelType;
  locationLat: number;
  locationLng: number;
  distanceFromGateM: number | null;
  addressText: string | null;
  description: string | null;
  rules: string | null;
  caretakerPhone: string;
  priceRangeMin: number;
  priceRangeMax: number;
  rating: number;
  status: "pending" | "approved" | "rejected";
  photos: string[];
  amenityIds: string[];
}

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface Issue {
  id: string;
  studentId: string;
  hostelId: string;
  description: string;
  status: "open" | "resolved";
  createdAt: Date;
}

export interface Booking {
  id: string;
  studentId: string;
  roomId: string;
  hostelId: string;
  bookingDate: Date;
  status: BookingStatus;
  bookingFeeAmount: number;
  reservedUntil: Date | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  studentId: string;
  amount: number;
  momoTxnId: string;
  provider: "MTN" | "Airtel";
  status: "success";
  paymentType: "booking_fee";
  createdAt: Date;
}

let idCounter = 0;
export function genId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}${idCounter.toString(36)}`;
}

export const DEMO_USERS: DemoUser[] = [
  { id: "user-admin", name: "Super Admin", phone: "0700000000", password: "password123", role: "super_admin" },
  { id: "user-owner", name: "John Custodian", phone: "0700000001", password: "password123", role: "hostel_owner" },
  { id: "user-student", name: "Jane Student", phone: "0700000002", password: "password123", role: "student", gender: "female" },
];

export const universities: University[] = [
  { id: "uni-makerere", name: "Makerere University", mainLat: 0.3354, mainLng: 32.5695, district: "Kampala" },
  { id: "uni-kyambogo", name: "Kyambogo University", mainLat: 0.3617, mainLng: 32.6234, district: "Kampala" },
  { id: "uni-mubs", name: "Makerere University Business School (MUBS)", mainLat: 0.3298, mainLng: 32.6198, district: "Kampala" },
  { id: "uni-ucu", name: "Uganda Christian University (UCU)", mainLat: 0.3546, mainLng: 32.7642, district: "Mukono" },
  { id: "uni-miu", name: "Metropolitan International University (MIU)", mainLat: -1.286, mainLng: 29.685, district: "Kisoro" },
];

export const amenities: Amenity[] = [
  "WiFi",
  "Water",
  "Parking",
  "Security",
  "Generator",
  "Reading Room",
  "Kitchen",
].map((name) => ({ id: `amenity-${name.toLowerCase().replace(/\s+/g, "-")}`, name }));

function amenityIdsFor(names: string[]) {
  return names.map((name) => amenities.find((a) => a.name === name)!.id);
}

function photosFor(slug: string, count = 3) {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${slug}-${i + 1}/800/600`);
}

type HostelSeed = {
  id: string;
  universityId: string;
  hostelName: string;
  type: HostelType;
  latOffset: number;
  lngOffset: number;
  distanceFromGateM: number;
  priceRangeMin: number;
  priceRangeMax: number;
  caretakerPhone: string;
  description: string;
  rules: string;
  amenityNames: string[];
  rooms: { roomNo: string; roomType: RoomType; totalBeds: number; pricePerSemester: number; pricePerMonth: number }[];
};

const hostelSeeds: HostelSeed[] = [
  {
    id: "hostel-sunset-girls-hostel",
    universityId: "uni-makerere",
    hostelName: "Sunset Girls Hostel",
    type: "girls_only",
    latOffset: 0.002,
    lngOffset: 0.001,
    distanceFromGateM: 300,
    priceRangeMin: 350000,
    priceRangeMax: 550000,
    caretakerPhone: "0771234001",
    description: "A quiet, secure hostel for female students, 5 minutes' walk from the main gate.",
    rules: "No visitors after 10pm. Keep noise down after 9pm. No cooking in rooms.",
    amenityNames: ["WiFi", "Water", "Security", "Reading Room"],
    rooms: [
      { roomNo: "A1", roomType: "single", totalBeds: 1, pricePerSemester: 550000, pricePerMonth: 180000 },
      { roomNo: "A2", roomType: "double", totalBeds: 2, pricePerSemester: 400000, pricePerMonth: 140000 },
      { roomNo: "A3", roomType: "double", totalBeds: 2, pricePerSemester: 400000, pricePerMonth: 140000 },
    ],
  },
  {
    id: "hostel-kikoni-boys-hall",
    universityId: "uni-makerere",
    hostelName: "Kikoni Boys Hall",
    type: "boys_only",
    latOffset: -0.0015,
    lngOffset: 0.0025,
    distanceFromGateM: 450,
    priceRangeMin: 300000,
    priceRangeMax: 500000,
    caretakerPhone: "0771234002",
    description: "Popular boys hostel near Kikoni with a shared common room and generator backup.",
    rules: "No smoking indoors. Visitors sign in at the gate.",
    amenityNames: ["WiFi", "Water", "Generator", "Parking"],
    rooms: [
      { roomNo: "B1", roomType: "single", totalBeds: 1, pricePerSemester: 500000, pricePerMonth: 170000 },
      { roomNo: "B2", roomType: "triple", totalBeds: 3, pricePerSemester: 300000, pricePerMonth: 100000 },
    ],
  },
  {
    id: "hostel-wandegeya-mixed-hostel",
    universityId: "uni-makerere",
    hostelName: "Wandegeya Mixed Hostel",
    type: "mixed",
    latOffset: 0.001,
    lngOffset: -0.002,
    distanceFromGateM: 600,
    priceRangeMin: 320000,
    priceRangeMax: 480000,
    caretakerPhone: "0771234003",
    description: "Mixed hostel with separate wings for men and women, close to Wandegeya market.",
    rules: "Separate wings for men and women. Curfew at 11pm on weekdays.",
    amenityNames: ["WiFi", "Water", "Security", "Kitchen"],
    rooms: [
      { roomNo: "C1", roomType: "double", totalBeds: 2, pricePerSemester: 420000, pricePerMonth: 150000 },
      { roomNo: "C2", roomType: "single", totalBeds: 1, pricePerSemester: 480000, pricePerMonth: 160000 },
    ],
  },
  {
    id: "hostel-kyambogo-view-girls-hostel",
    universityId: "uni-kyambogo",
    hostelName: "Kyambogo View Girls Hostel",
    type: "girls_only",
    latOffset: 0.0018,
    lngOffset: 0.0012,
    distanceFromGateM: 250,
    priceRangeMin: 300000,
    priceRangeMax: 450000,
    caretakerPhone: "0771234004",
    description: "Close to Kyambogo main gate with good views and reliable water supply.",
    rules: "No male visitors past the reception area.",
    amenityNames: ["WiFi", "Water", "Security"],
    rooms: [
      { roomNo: "D1", roomType: "double", totalBeds: 2, pricePerSemester: 380000, pricePerMonth: 130000 },
      { roomNo: "D2", roomType: "triple", totalBeds: 3, pricePerSemester: 300000, pricePerMonth: 100000 },
    ],
  },
  {
    id: "hostel-banda-boys-residence",
    universityId: "uni-kyambogo",
    hostelName: "Banda Boys Residence",
    type: "boys_only",
    latOffset: -0.002,
    lngOffset: 0.0008,
    distanceFromGateM: 700,
    priceRangeMin: 280000,
    priceRangeMax: 420000,
    caretakerPhone: "0771234005",
    description: "Affordable boys residence in Banda with parking for boda bodas and cars.",
    rules: "Rent due by the 5th of every month.",
    amenityNames: ["Water", "Parking", "Generator"],
    rooms: [
      { roomNo: "E1", roomType: "single", totalBeds: 1, pricePerSemester: 420000, pricePerMonth: 140000 },
      { roomNo: "E2", roomType: "double", totalBeds: 2, pricePerSemester: 350000, pricePerMonth: 120000 },
    ],
  },
  {
    id: "hostel-nakawa-business-hostel",
    universityId: "uni-mubs",
    hostelName: "Nakawa Business Hostel",
    type: "mixed",
    latOffset: 0.001,
    lngOffset: 0.0015,
    distanceFromGateM: 350,
    priceRangeMin: 350000,
    priceRangeMax: 600000,
    caretakerPhone: "0771234006",
    description: "Modern mixed hostel near MUBS with study rooms and fast WiFi.",
    rules: "Study room quiet hours 8pm-11pm.",
    amenityNames: ["WiFi", "Water", "Security", "Reading Room", "Kitchen"],
    rooms: [
      { roomNo: "F1", roomType: "single", totalBeds: 1, pricePerSemester: 600000, pricePerMonth: 200000 },
      { roomNo: "F2", roomType: "double", totalBeds: 2, pricePerSemester: 450000, pricePerMonth: 150000 },
    ],
  },
  {
    id: "hostel-mukono-girls-hostel",
    universityId: "uni-ucu",
    hostelName: "Mukono Girls Hostel",
    type: "girls_only",
    latOffset: 0.0012,
    lngOffset: -0.001,
    distanceFromGateM: 400,
    priceRangeMin: 320000,
    priceRangeMax: 500000,
    caretakerPhone: "0771234007",
    description: "Christian-friendly girls hostel a short walk from UCU main campus.",
    rules: "Devotion every Wednesday evening (optional). Gates close at 10pm.",
    amenityNames: ["WiFi", "Water", "Security"],
    rooms: [
      { roomNo: "G1", roomType: "double", totalBeds: 2, pricePerSemester: 400000, pricePerMonth: 140000 },
      { roomNo: "G2", roomType: "single", totalBeds: 1, pricePerSemester: 500000, pricePerMonth: 170000 },
    ],
  },
  {
    id: "hostel-ucu-mixed-annex",
    universityId: "uni-ucu",
    hostelName: "UCU Mixed Annex",
    type: "mixed",
    latOffset: -0.0016,
    lngOffset: 0.0018,
    distanceFromGateM: 550,
    priceRangeMin: 300000,
    priceRangeMax: 470000,
    caretakerPhone: "0771234008",
    description: "Budget-friendly mixed annex with separate blocks and a shared kitchen.",
    rules: "No overnight visitors of the opposite gender.",
    amenityNames: ["Water", "Kitchen", "Parking"],
    rooms: [
      { roomNo: "H1", roomType: "triple", totalBeds: 3, pricePerSemester: 300000, pricePerMonth: 100000 },
      { roomNo: "H2", roomType: "double", totalBeds: 2, pricePerSemester: 380000, pricePerMonth: 130000 },
    ],
  },
  {
    id: "hostel-kisoro-girls-hostel",
    universityId: "uni-miu",
    hostelName: "Kisoro Girls Hostel",
    type: "girls_only",
    latOffset: 0.0014,
    lngOffset: 0.001,
    distanceFromGateM: 350,
    priceRangeMin: 280000,
    priceRangeMax: 450000,
    caretakerPhone: "0771234009",
    description: "Secure girls hostel a short walk from MIU main campus, with a scenic view of the Virunga foothills.",
    rules: "Gates close at 9:30pm. Visitors sign in at reception.",
    amenityNames: ["WiFi", "Water", "Security"],
    rooms: [
      { roomNo: "I1", roomType: "double", totalBeds: 2, pricePerSemester: 380000, pricePerMonth: 130000 },
      { roomNo: "I2", roomType: "single", totalBeds: 1, pricePerSemester: 450000, pricePerMonth: 150000 },
    ],
  },
  {
    id: "hostel-miu-mixed-hostel",
    universityId: "uni-miu",
    hostelName: "MIU Mixed Hostel",
    type: "mixed",
    latOffset: -0.0018,
    lngOffset: -0.0012,
    distanceFromGateM: 500,
    priceRangeMin: 260000,
    priceRangeMax: 420000,
    caretakerPhone: "0771234010",
    description: "Affordable mixed hostel with separate wings, popular with international students at MIU.",
    rules: "Quiet hours from 10pm. No cooking in rooms.",
    amenityNames: ["Water", "Parking", "Generator"],
    rooms: [
      { roomNo: "J1", roomType: "triple", totalBeds: 3, pricePerSemester: 260000, pricePerMonth: 90000 },
      { roomNo: "J2", roomType: "double", totalBeds: 2, pricePerSemester: 340000, pricePerMonth: 120000 },
    ],
  },
];

const initialHostels: Hostel[] = hostelSeeds.map((seed) => {
  const uni = universities.find((u) => u.id === seed.universityId)!;
  return {
    id: seed.id,
    ownerId: "user-owner",
    universityId: seed.universityId,
    hostelName: seed.hostelName,
    type: seed.type,
    locationLat: uni.mainLat + seed.latOffset,
    locationLng: uni.mainLng + seed.lngOffset,
    distanceFromGateM: seed.distanceFromGateM,
    addressText: `${seed.distanceFromGateM}m from ${uni.name} main gate`,
    description: seed.description,
    rules: seed.rules,
    caretakerPhone: seed.caretakerPhone,
    priceRangeMin: seed.priceRangeMin,
    priceRangeMax: seed.priceRangeMax,
    rating: 0,
    status: "approved",
    photos: photosFor(seed.id),
    amenityIds: amenityIdsFor(seed.amenityNames),
  };
});

const initialRooms: Room[] = hostelSeeds.flatMap((seed) =>
  seed.rooms.map((r) => ({
    id: `room-${seed.id}-${r.roomNo.toLowerCase()}`,
    hostelId: seed.id,
    roomNo: r.roomNo,
    roomType: r.roomType,
    totalBeds: r.totalBeds,
    bedsAvailable: r.totalBeds,
    pricePerSemester: r.pricePerSemester,
    pricePerMonth: r.pricePerMonth,
    status: "available" as const,
  }))
);

// Next.js's dev bundler (and, on Vercel, separate serverless functions) can
// give API routes and page components their own module instances, so plain
// `export const` arrays don't reliably share mutations between them. Pinning
// the mutable state to `globalThis` forces every module instance within the
// same process to read/write the exact same objects — the same trick
// `src/lib/prisma.ts` used to use for its client singleton.
type Store = {
  hostels: Hostel[];
  rooms: Room[];
  reviews: Review[];
  issues: Issue[];
  bookings: Booking[];
  payments: Payment[];
  registeredUsers: DemoUser[];
};

const globalForStore = globalThis as unknown as { __hostelStore?: Store };

const store: Store =
  globalForStore.__hostelStore ??
  (globalForStore.__hostelStore = {
    hostels: initialHostels,
    rooms: initialRooms,
    reviews: [],
    issues: [],
    bookings: [],
    payments: [],
    registeredUsers: [],
  });

export const hostels = store.hostels;
export const rooms = store.rooms;
export const reviews = store.reviews;
export const issues = store.issues;
export const bookings = store.bookings;
export const payments = store.payments;
export const registeredUsers = store.registeredUsers;

export function findUserByPhone(phone: string): DemoUser | undefined {
  return DEMO_USERS.find((u) => u.phone === phone) ?? registeredUsers.find((u) => u.phone === phone);
}

export function recomputeHostelRating(hostelId: string) {
  const hostelReviews = reviews.filter((r) => r.hostelId === hostelId);
  const hostel = hostels.find((h) => h.id === hostelId);
  if (!hostel) return;
  hostel.rating =
    hostelReviews.length > 0
      ? hostelReviews.reduce((sum, r) => sum + r.rating, 0) / hostelReviews.length
      : 0;
}
