import { PrismaClient, HostelType, RoomType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function photosFor(slug: string, count = 3) {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${slug}-${i + 1}/800/600`);
}

const universitySeeds = [
  { id: "uni-makerere", name: "Makerere University", mainLat: 0.3354, mainLng: 32.5695, district: "Kampala" },
  { id: "uni-kyambogo", name: "Kyambogo University", mainLat: 0.3617, mainLng: 32.6234, district: "Kampala" },
  { id: "uni-mubs", name: "Makerere University Business School (MUBS)", mainLat: 0.3298, mainLng: 32.6198, district: "Kampala" },
  { id: "uni-ucu", name: "Uganda Christian University (UCU)", mainLat: 0.3546, mainLng: 32.7642, district: "Mukono" },
  { id: "uni-miu", name: "Metropolitan International University (MIU)", mainLat: -1.286, mainLng: 29.685, district: "Kisoro" },
];

const amenityNames = ["WiFi", "Water", "Parking", "Security", "Generator", "Reading Room", "Kitchen"];

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

async function main() {
  console.log("Seeding universities...");
  for (const uni of universitySeeds) {
    await prisma.university.upsert({
      where: { id: uni.id },
      update: uni,
      create: uni,
    });
  }

  console.log("Seeding amenities...");
  const amenityByName = new Map<string, string>();
  for (const name of amenityNames) {
    const amenity = await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    amenityByName.set(name, amenity.id);
  }

  console.log("Seeding demo accounts...");
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { phone: "0700000000" },
    update: {},
    create: {
      name: "Super Admin",
      phone: "0700000000",
      email: "admin@hostelfinder.ug",
      passwordHash,
      role: "super_admin",
    },
  });
  const owner = await prisma.user.upsert({
    where: { phone: "0700000001" },
    update: {},
    create: {
      name: "John Custodian",
      phone: "0700000001",
      email: "owner@hostelfinder.ug",
      passwordHash,
      role: "hostel_owner",
    },
  });
  await prisma.user.upsert({
    where: { phone: "0700000002" },
    update: {},
    create: {
      name: "Jane Student",
      phone: "0700000002",
      email: "student@hostelfinder.ug",
      passwordHash,
      role: "student",
      gender: "female",
    },
  });

  console.log("Seeding hostels and rooms...");
  for (const seed of hostelSeeds) {
    const uni = universitySeeds.find((u) => u.id === seed.universityId)!;
    const hostel = await prisma.hostel.upsert({
      where: { id: seed.id },
      update: {},
      create: {
        id: seed.id,
        ownerId: owner.id,
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
        status: "approved",
        photos: photosFor(seed.id),
        amenities: {
          create: seed.amenityNames.map((name) => ({ amenityId: amenityByName.get(name)! })),
        },
      },
    });

    for (const room of seed.rooms) {
      await prisma.room.upsert({
        where: { id: `room-${seed.id}-${room.roomNo.toLowerCase()}` },
        update: {},
        create: {
          id: `room-${seed.id}-${room.roomNo.toLowerCase()}`,
          hostelId: hostel.id,
          roomNo: room.roomNo,
          roomType: room.roomType,
          totalBeds: room.totalBeds,
          bedsAvailable: room.totalBeds,
          pricePerSemester: room.pricePerSemester,
          pricePerMonth: room.pricePerMonth,
          status: "available",
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
