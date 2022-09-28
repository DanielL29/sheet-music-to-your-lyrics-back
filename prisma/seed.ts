import prisma from '../src/database';

async function main() {
  await prisma.category.upsert({ where: { name: 'Pop' }, update: {}, create: { name: 'Pop' } });
  await prisma.category.upsert({ where: { name: 'Eletronica' }, update: {}, create: { name: 'Eletronica' } });
  await prisma.category.upsert({ where: { name: 'Rock' }, update: {}, create: { name: 'Rock' } });
  await prisma.category.upsert({ where: { name: 'Indie' }, update: {}, create: { name: 'Indie' } });
  await prisma.category.upsert({ where: { name: 'Sertanejo' }, update: {}, create: { name: 'Sertanejo' } });
  await prisma.category.upsert({ where: { name: 'Funk' }, update: {}, create: { name: 'Funk' } });
  await prisma.category.upsert({ where: { name: 'Jazz' }, update: {}, create: { name: 'Jazz' } });
  await prisma.category.upsert({ where: { name: 'MPB' }, update: {}, create: { name: 'MPB' } });
  await prisma.category.upsert({ where: { name: 'Bossa Nova' }, update: {}, create: { name: 'Bossa Nova' } });
  await prisma.category.upsert({ where: { name: 'Reggae' }, update: {}, create: { name: 'Reggae' } });
  await prisma.category.upsert({ where: { name: 'Country' }, update: {}, create: { name: 'Country' } });
  await prisma.category.upsert({ where: { name: 'Outros' }, update: {}, create: { name: 'Outros' } });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
