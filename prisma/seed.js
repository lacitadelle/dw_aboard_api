const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'alice@example.com', name: 'Alice' },
    { email: 'bob@example.com', name: 'Bob' },
    { email: 'carol@example.com', name: 'Carol' },
    { email: 'david@example.com', name: 'David' },
    { email: 'eve@example.com', name: 'Eve' },
    { email: 'frank@example.com', name: 'Frank' },
    { email: 'grace@example.com', name: 'Grace' },
    { email: 'henry@example.com', name: 'Henry' },
    { email: 'isabel@example.com', name: 'Isabel' },
    { email: 'john@example.com', name: 'John' },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
