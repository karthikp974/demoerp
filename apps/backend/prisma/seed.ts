import {
  CampusIsolationPolicy,
  PrismaClient,
  ProgramDurationUnit,
  ProgramStructureScope,
  StructureStatus,
  UserStatus,
  UserType
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { ensureDemoAcademicStructure } from "../src/demo/demo-academic-structure";
import { ensureTeacherDemoAccounts } from "../src/demo/teacher-demo";
import { ensureDemoStudent } from "../src/demo/student-demo";

function step(label: string) {
  console.log(`[seed] ${label} @ ${new Date().toISOString()}`);
}

step("STEP 0: WFT Institutions seed — single campus, single database");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

/** One demo institution — no KIET/KIEK/KIEW groups or shared-campus logic in seed data. */
const WFT_CAMPUS_CODE = "WFT";
const WFT_CAMPUS_NAME = "WFT Institutions";

const academicCatalog = [
  {
    code: "BTECH",
    name: "BTech",
    durationYears: 4,
    branches: [
      { code: "CSC", name: "CSE Cyber Security" },
      { code: "CSE", name: "Computer Science Engineering" },
      { code: "CSAIML", name: "CSE AI and Machine Learning" }
    ]
  },
  {
    code: "MBA",
    name: "MBA",
    durationYears: 2,
    branches: [{ code: "CS", name: "Computer Science" }]
  },
  {
    code: "MCA",
    name: "MCA",
    durationYears: 2,
    branches: [{ code: "CS", name: "Computer Science" }]
  }
] as const;

async function main() {
  step("connecting");
  await prisma.$connect();

  step("campus group");
  const group = await prisma.campusGroup.upsert({
    where: { name: "WFT Institutions" },
    update: { isolationPolicy: CampusIsolationPolicy.ISOLATED },
    create: { name: "WFT Institutions", isolationPolicy: CampusIsolationPolicy.ISOLATED }
  });

  step("campus");
  const campus = await prisma.campus.upsert({
    where: { code: WFT_CAMPUS_CODE },
    update: {
      groupId: group.id,
      name: WFT_CAMPUS_NAME,
      isActive: true,
      status: StructureStatus.ACTIVE
    },
    create: {
      code: WFT_CAMPUS_CODE,
      name: WFT_CAMPUS_NAME,
      groupId: group.id,
      isActive: true,
      status: StructureStatus.ACTIVE
    }
  });

  step("departments and branches");
  for (const departmentInput of academicCatalog) {
    const department = await prisma.program.upsert({
      where: { campusId_code: { campusId: campus.id, code: departmentInput.code } },
      update: {
        name: departmentInput.name,
        durationValue: departmentInput.durationYears,
        durationUnit: ProgramDurationUnit.YEAR,
        semesters: departmentInput.durationYears * 2,
        structureScope: ProgramStructureScope.CAMPUS_OWNED,
        status: StructureStatus.ACTIVE,
        isArchived: false,
        archivedAt: null
      },
      create: {
        campusId: campus.id,
        code: departmentInput.code,
        name: departmentInput.name,
        durationValue: departmentInput.durationYears,
        durationUnit: ProgramDurationUnit.YEAR,
        semesters: departmentInput.durationYears * 2,
        structureScope: ProgramStructureScope.CAMPUS_OWNED,
        status: StructureStatus.ACTIVE
      }
    });

    for (const branchInput of departmentInput.branches) {
      await prisma.branch.upsert({
        where: { programId_code: { programId: department.id, code: branchInput.code } },
        update: {
          name: branchInput.name,
          status: StructureStatus.ACTIVE,
          isArchived: false,
          archivedAt: null
        },
        create: {
          programId: department.id,
          code: branchInput.code,
          name: branchInput.name,
          status: StructureStatus.ACTIVE
        }
      });
    }
  }

  step("admin user");
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@wft.local" },
    update: { username: "admin", passwordHash, status: UserStatus.ACTIVE },
    create: {
      email: "admin@wft.local",
      username: "admin",
      passwordHash,
      fullName: "WFT Admin",
      type: UserType.ADMIN,
      status: UserStatus.ACTIVE
    }
  });

  const ownerPassword = process.env.ERP_OWNER_PASSWORD ?? "WftDemo@123";
  const ownerHash = await bcrypt.hash(ownerPassword.trim(), 12);
  await prisma.user.upsert({
    where: { username: "wftowner" },
    update: {
      passwordHash: ownerHash,
      status: UserStatus.ACTIVE,
      type: UserType.ADMIN,
      fullName: "WFT Owner"
    },
    create: {
      email: "owner@wft.local",
      username: "wftowner",
      passwordHash: ownerHash,
      fullName: "WFT Owner",
      type: UserType.ADMIN,
      status: UserStatus.ACTIVE
    }
  });
  console.info("Owner account ready — username wftowner (spectator console at /ops).");

  const structure = await ensureDemoAcademicStructure(prisma);
  if (!structure) {
    console.warn("Demo academic structure skipped — WFT BTECH CSC catalog missing.");
  }

  const teacherResult = await ensureTeacherDemoAccounts(prisma);
  if (teacherResult.ok) {
    console.info(`Seeded ${teacherResult.created} demo teachers — password TeacherDemo@123 (e.g. HTPO001).`);
  } else {
    console.warn(`Demo teachers skipped: ${teacherResult.reason}`);
  }

  const studentDemo = await ensureDemoStudent(prisma);
  if (studentDemo.ok) {
    console.info("Seeded demo students — password StudentDemo@123");
  } else {
    console.warn(`Demo student skipped: ${studentDemo.reason}`);
  }

  const { ensureDemoTimetableSlots } = await import("../src/demo/demo-timetable-slots");
  const timetableDemo = await ensureDemoTimetableSlots(prisma);
  if (timetableDemo.ok) {
    console.info(`Seeded ${timetableDemo.created} demo timetable slot(s).`);
  } else {
    console.warn(`Demo timetable skipped: ${timetableDemo.reason}`);
  }

  step("complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.info("WFT Institutions seed finished OK.");
  })
  .catch(async (error) => {
    console.error("[seed] FAILED:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
