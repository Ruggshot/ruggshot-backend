import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrpyt from 'bcrypt';

const prisma = new PrismaClient();

const customerData: Prisma.CustomerCreateInput[] = [
  {
    name: 'Attic Crew Industries',
  },
  {
    name: 'Powerful Insulation Inc',
  },
  {
    name: 'Rodent Science',
  },
];

const orgData: Prisma.OrganizationCreateInput[] = [
  {
    name: 'Super Attic Solutions',
    customer: {
      connect: { id: 1 },
    },
  },
  {
    name: 'Rodents Begone!',
    customer: {
      connect: { id: 1 },
    },
  },
  {
    name: 'Green Attics',
    customer: {
      connect: { id: 1 },
    },
  },
  {
    name: 'Attics & more!',
    customer: {
      connect: { id: 1 },
    },
  },

  {
    name: 'Attic Solutions',
    customer: {
      connect: { id: 2 },
    },
  },
  {
    name: 'Attic Insulation',
    customer: {
      connect: { id: 2 },
    },
  },
  {
    name: 'Attic Construction',
    customer: {
      connect: { id: 2 },
    },
  },
  {
    name: 'Rodent Removal',
    customer: {
      connect: { id: 3 },
    },
  },
  {
    name: 'Rodent Begone',
    customer: {
      connect: { id: 3 },
    },
  },
  {
    name: 'Rats Out!',
    customer: {
      connect: { id: 3 },
    },
  },
];

async function main() {
  // console.log(`Start seeding ...`);
  // for (const u of userData) {
  //   const user = await prisma.fUser.create({
  //     data: u,
  //   });
  //   console.log(`Created user with id: ${user.id}`);
  // }
  // createAdmin();

  for (const c of customerData) {
    const customer = await prisma.customer.create({
      data: c,
    });
    console.log(`Created customer with id: ${customer.id}`);
  }

  for (const u of orgData) {
    const org = await prisma.organization.create({
      data: u,
    });
    console.log(`Created org with name: ${org.name}`);
  }

  return prisma.user.create({
    data: {
      name: 'Admin',
      phone_number: '+972547578388',
      password: await bcrpyt.hash('admin', 10),
      activeOrganization: 1,
      organizations: {
        connect: [
          {
            id: 1,
          },
        ],
      },
    },
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
