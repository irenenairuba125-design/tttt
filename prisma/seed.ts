import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function photosFor(slug: string, count = 3) {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${slug}-${i + 1}/800/600`);
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
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

  const amenityNames = ["WiFi", "Water", "Parking", "Security", "Generator", "Reading Room", "Kitchen"];
  const amenities = await Promise.all(
    amenityNames.map((name) =>
      prisma.amenity.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  const amenityByName = Object.fromEntries(amenities.map((a) => [a.name, a]));

  const universities = await Promise.all([
    prisma.university.upsert({
      where: { id: "uni-makerere" },
      update: {},
      create: {
        id: "uni-makerere",
        name: "Makerere University",
        mainLat: 0.3354,
        mainLng: 32.5695,
        district: "Kampala",
      },
    }),
    prisma.university.upsert({
      where: { id: "uni-kyambogo" },
      update: {},
      create: {
        id: "uni-kyambogo",
        name: "Kyambogo University",
        mainLat: 0.3617,
        mainLng: 32.6234,
        district: "Kampala",
      },
    }),
    prisma.university.upsert({
      where: { id: "uni-mubs" },
      update: {},
      create: {
        id: "uni-mubs",
        name: "Makerere University Business School (MUBS)",
        mainLat: 0.3298,
        mainLng: 32.6198,
        district: "Kampala",
      },
    }),
    prisma.university.upsert({
      where: { id: "uni-ucu" },
      update: {},
      create: {
        id: "uni-ucu",
        name: "Uganda Christian University (UCU)",
        mainLat: 0.3546,
        mainLng: 32.7642,
        district: "Mukono",
      },
    }),
    prisma.university.upsert({
      where: { id: "uni-miu" },
      update: {},
      create: {
        id: "uni-miu",
        name: "Metropolitan International University (MIU)",
        mainLat: -1.286,
        mainLng: 29.685,
        district: "Kisoro",
      },
    }),
  ]);

  const hostelSeeds = [
    {
      universityId: "uni-makerere",
      hostelName: "Sunset Girls Hostel",
      type: "girls_only" as const,
      latOffset: 0.002,
      lngOffset: 0.001,
      distanceFromGateM: 300,
      priceRangeMin: 350000,
      priceRangeMax: 550000,
      caretakerPhone: "0771234001",
      description: "A quiet, secure hostel for female students, 5 minutes' walk from the main gate.",
      rules: "No visitors after 10pm. Keep noise down after 9pm. No cooking in rooms.",
      amenities: ["WiFi", "Water", "Security", "Reading Room"],
      rooms: [
        { roomNo: "A1", roomType: "single" as const, totalBeds: 1, pricePerSemester: 550000, pricePerMonth: 180000 },
        { roomNo: "A2", roomType: "double" as const, totalBeds: 2, pricePerSemester: 400000, pricePerMonth: 140000 },
        { roomNo: "A3", roomType: "double" as const, totalBeds: 2, pricePerSemester: 400000, pricePerMonth: 140000 },
      ],
    },
    {
      universityId: "uni-makerere",
      hostelName: "Kikoni Boys Hall",
      type: "boys_only" as const,
      latOffset: -0.0015,
      lngOffset: 0.0025,
      distanceFromGateM: 450,
      priceRangeMin: 300000,
      priceRangeMax: 500000,
      caretakerPhone: "0771234002",
      description: "Popular boys hostel near Kikoni with a shared common room and generator backup.",
      rules: "No smoking indoors. Visitors sign in at the gate.",
      amenities: ["WiFi", "Water", "Generator", "Parking"],
      rooms: [
        { roomNo: "B1", roomType: "single" as const, totalBeds: 1, pricePerSemester: 500000, pricePerMonth: 170000 },
        { roomNo: "B2", roomType: "triple" as const, totalBeds: 3, pricePerSemester: 300000, pricePerMonth: 100000 },
      ],
    },
    {
      universityId: "uni-makerere",
      hostelName: "Wandegeya Mixed Hostel",
      type: "mixed" as const,
      latOffset: 0.001,
      lngOffset: -0.002,
      distanceFromGateM: 600,
      priceRangeMin: 320000,
      priceRangeMax: 480000,
      caretakerPhone: "0771234003",
      description: "Mixed hostel with separate wings for men and women, close to Wandegeya market.",
      rules: "Separate wings for men and women. Curfew at 11pm on weekdays.",
      amenities: ["WiFi", "Water", "Security", "Kitchen"],
      rooms: [
        { roomNo: "C1", roomType: "double" as const, totalBeds: 2, pricePerSemester: 420000, pricePerMonth: 150000 },
        { roomNo: "C2", roomType: "single" as const, totalBeds: 1, pricePerSemester: 480000, pricePerMonth: 160000 },
      ],
    },
    {
      universityId: "uni-kyambogo",
      hostelName: "Kyambogo View Girls Hostel",
      type: "girls_only" as const,
      latOffset: 0.0018,
      lngOffset: 0.0012,
      distanceFromGateM: 250,
      priceRangeMin: 300000,
      priceRangeMax: 450000,
      caretakerPhone: "0771234004",
      description: "Close to Kyambogo main gate with good views and reliable water supply.",
      rules: "No male visitors past the reception area.",
      amenities: ["WiFi", "Water", "Security"],
      rooms: [
        { roomNo: "D1", roomType: "double" as const, totalBeds: 2, pricePerSemester: 380000, pricePerMonth: 130000 },
        { roomNo: "D2", roomType: "triple" as const, totalBeds: 3, pricePerSemester: 300000, pricePerMonth: 100000 },
      ],
    },
    {
      universityId: "uni-kyambogo",
      hostelName: "Banda Boys Residence",
      type: "boys_only" as const,
      latOffset: -0.002,
      lngOffset: 0.0008,
      distanceFromGateM: 700,
      priceRangeMin: 280000,
      priceRangeMax: 420000,
      caretakerPhone: "0771234005",
      description: "Affordable boys residence in Banda with parking for boda bodas and cars.",
      rules: "Rent due by the 5th of every month.",
      amenities: ["Water", "Parking", "Generator"],
      rooms: [
        { roomNo: "E1", roomType: "single" as const, totalBeds: 1, pricePerSemester: 420000, pricePerMonth: 140000 },
        { roomNo: "E2", roomType: "double" as const, totalBeds: 2, pricePerSemester: 350000, pricePerMonth: 120000 },
      ],
    },
    {
      universityId: "uni-mubs",
      hostelName: "Nakawa Business Hostel",
      type: "mixed" as const,
      latOffset: 0.001,
      lngOffset: 0.0015,
      distanceFromGateM: 350,
      priceRangeMin: 350000,
      priceRangeMax: 600000,
      caretakerPhone: "0771234006",
      description: "Modern mixed hostel near MUBS with study rooms and fast WiFi.",
      rules: "Study room quiet hours 8pm-11pm.",
      amenities: ["WiFi", "Water", "Security", "Reading Room", "Kitchen"],
      rooms: [
        { roomNo: "F1", roomType: "single" as const, totalBeds: 1, pricePerSemester: 600000, pricePerMonth: 200000 },
        { roomNo: "F2", roomType: "double" as const, totalBeds: 2, pricePerSemester: 450000, pricePerMonth: 150000 },
      ],
    },
    {
      universityId: "uni-ucu",
      hostelName: "Mukono Girls Hostel",
      type: "girls_only" as const,
      latOffset: 0.0012,
      lngOffset: -0.001,
      distanceFromGateM: 400,
      priceRangeMin: 320000,
      priceRangeMax: 500000,
      caretakerPhone: "0771234007",
      description: "Christian-friendly girls hostel a short walk from UCU main campus.",
      rules: "Devotion every Wednesday evening (optional). Gates close at 10pm.",
      amenities: ["WiFi", "Water", "Security"],
      rooms: [
        { roomNo: "G1", roomType: "double" as const, totalBeds: 2, pricePerSemester: 400000, pricePerMonth: 140000 },
        { roomNo: "G2", roomType: "single" as const, totalBeds: 1, pricePerSemester: 500000, pricePerMonth: 170000 },
      ],
    },
    {
      universityId: "uni-ucu",
      hostelName: "UCU Mixed Annex",
      type: "mixed" as const,
      latOffset: -0.0016,
      lngOffset: 0.0018,
      distanceFromGateM: 550,
      priceRangeMin: 300000,
      priceRangeMax: 470000,
      caretakerPhone: "0771234008",
      description: "Budget-friendly mixed annex with separate blocks and a shared kitchen.",
      rules: "No overnight visitors of the opposite gender.",
      amenities: ["Water", "Kitchen", "Parking"],
      rooms: [
        { roomNo: "H1", roomType: "triple" as const, totalBeds: 3, pricePerSemester: 300000, pricePerMonth: 100000 },
        { roomNo: "H2", roomType: "double" as const, totalBeds: 2, pricePerSemester: 380000, pricePerMonth: 130000 },
      ],
    },
    {
      universityId: "uni-miu",
      hostelName: "Kisoro Girls Hostel",
      type: "girls_only" as const,
      latOffset: 0.0014,
      lngOffset: 0.001,
      distanceFromGateM: 350,
      priceRangeMin: 280000,
      priceRangeMax: 450000,
      caretakerPhone: "0771234009",
      description: "Secure girls hostel a short walk from MIU main campus, with a scenic view of the Virunga foothills.",
      rules: "Gates close at 9:30pm. Visitors sign in at reception.",
      amenities: ["WiFi", "Water", "Security"],
      rooms: [
        { roomNo: "I1", roomType: "double" as const, totalBeds: 2, pricePerSemester: 380000, pricePerMonth: 130000 },
        { roomNo: "I2", roomType: "single" as const, totalBeds: 1, pricePerSemester: 450000, pricePerMonth: 150000 },
      ],
    },
    {
      universityId: "uni-miu",
      hostelName: "MIU Mixed Hostel",
      type: "mixed" as const,
      latOffset: -0.0018,
      lngOffset: -0.0012,
      distanceFromGateM: 500,
      priceRangeMin: 260000,
      priceRangeMax: 420000,
      caretakerPhone: "0771234010",
      description: "Affordable mixed hostel with separate wings, popular with international students at MIU.",
      rules: "Quiet hours from 10pm. No cooking in rooms.",
      amenities: ["Water", "Parking", "Generator"],
      rooms: [
        { roomNo: "J1", roomType: "triple" as const, totalBeds: 3, pricePerSemester: 260000, pricePerMonth: 90000 },
        { roomNo: "J2", roomType: "double" as const, totalBeds: 2, pricePerSemester: 340000, pricePerMonth: 120000 },
      ],
    },
  ];

  for (const seed of hostelSeeds) {
    const uni = universities.find((u) => u.id === seed.universityId)!;
    const slug = seed.hostelName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const hostel = await prisma.hostel.create({
      data: {
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
        photos: photosFor(slug),
        rooms: {
          create: seed.rooms.map((r) => ({
            roomNo: r.roomNo,
            roomType: r.roomType,
            totalBeds: r.totalBeds,
            bedsAvailable: r.totalBeds,
            pricePerSemester: r.pricePerSemester,
            pricePerMonth: r.pricePerMonth,
            status: "available",
          })),
        },
        amenities: {
          create: seed.amenities.map((name) => ({ amenityId: amenityByName[name].id })),
        },
      },
    });

    console.log(`Created hostel: ${hostel.hostelName}`);
  }

  console.log("Seed complete.");
  console.log(`Admin login: phone 0700000000 / password123`);
  console.log(`Student login: phone 0700000002 / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
