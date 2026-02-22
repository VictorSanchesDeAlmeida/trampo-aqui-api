import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.roles.createMany({
    data: [{ name: 'Admin' }, { name: 'User' }, { name: 'Company' }],
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@admin.com',
        document: '12345678900',
        birthDate: new Date('1990-01-01'),
        password: 'admin123',
        roleId: 1,
      },
    ],
    skipDuplicates: true,
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
