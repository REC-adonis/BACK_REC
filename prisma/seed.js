import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'leonel@gmail.com',
      password: 'leonel123',
      name: 'Leonel Ceballos',
      last_login: new Date(),
      isVerified: true,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      shippingInfo: {
        create: {
          address: 'Ruis senor, Aguilas',
          city: 'Colima',
          state: 'Colima',
          postal_code: '28000',
          phone_number: '3121231234',
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'omar@gmail.com',
      password: 'omar123',
      name: 'Omar Ballesteros',
      last_login: new Date(),
      isVerified: false,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      shippingInfo: {
        create: {
          address: 'Chanal 1222',
          city: 'Colima',
          state: 'Colima',
          postal_code: '28000',
          phone_number: '3128766677',
        },
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
