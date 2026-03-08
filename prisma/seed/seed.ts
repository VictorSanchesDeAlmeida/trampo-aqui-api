import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.roles.createMany({
    data: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User' },
      { id: 3, name: 'Company' },
    ],
  });

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@admin.com',
        document: '12345678900',
        birthDate: new Date('1990-01-01'),
        password: hashedPassword,
        roleId: 1,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
