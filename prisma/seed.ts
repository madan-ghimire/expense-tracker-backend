import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";
import USER_ROLES from "../src/schemas/auth/user-roles";
import {
  ADMIN_DEFAULTS,
  SU_ADMIN_DEFAULTS,
} from "../src/constants/static-lists";

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  role: string;
};

const prisma = new PrismaClient();

const users: User[] = [
  {
    id: "d373f17b-2ffd-4681-a841-984ec1a7c856",
    username: ADMIN_DEFAULTS.username,
    firstName: "ET",
    lastName: "Administrator",
    displayName: "ET Administrator",
    email: "noreply@xrdig.com",
    password: process.env.ADMIN_PASSWORD!,
    role: USER_ROLES.ADMINISTRATOR,
  },
  {
    id: "a704e733-a1a4-42b8-86ad-11639458189e",
    username: SU_ADMIN_DEFAULTS.username,
    firstName: "Super",
    lastName: "Administrator",
    displayName: "Super Administrator",
    email: "suadmin@xrdig.com",
    password: process.env.SU_ADMIN_PASSWORD!,
    role: USER_ROLES.ADMINISTRATOR,
  },
];

async function main() {
  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      const hashedPassword = await hashPassword(user.password);

      await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          role: user.role as Role,
          password: hashedPassword,
        },
      });
      console.log(`✅ Created: ${user.email}`);
    } else {
      console.log(`⏭️ Skipped (already exists): ${user.email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
