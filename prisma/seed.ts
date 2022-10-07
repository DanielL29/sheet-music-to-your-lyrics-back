import prisma from '../src/database';

async function main() {
  await prisma.category.upsert({
    where: { name: 'Pop' },
    update: {},
    create: {
      name: 'Pop',
      imageUrl: 'https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2Fd12b3eb0-10ec-11e8-aa39-e7299ff3a5e8.jpg?crop=3000%2C2000%2C0%2C0',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Eletronica' },
    update: {},
    create: {
      name: 'Eletronica',
      imageUrl: 'https://i.ytimg.com/vi/DBW-Rq4iEhQ/maxresdefault.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Rock' },
    update: {},
    create: {
      name: 'Rock',
      imageUrl: 'https://townsquare.media/site/366/files/2022/02/attachment-slash-20202.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Indie' },
    update: {},
    create: {
      name: 'Indie',
      imageUrl: 'https://www.hollywoodinsider.com/wp-content/uploads/2021/03/Hollywood-Insider-Indie-and-DIY-Music.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Sertanejo' },
    update: {},
    create: {
      name: 'Sertanejo',
      imageUrl: 'https://www.soulbrasil.com/wp-content/uploads/2019/02/unnamed-file.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Funk' },
    update: {},
    create: {
      name: 'Funk',
      imageUrl: 'https://thumbs.dreamstime.com/b/o-funk-texto-do-ouro-no-fundo-preto-d-rendeu-imagem-conservada-em-estoque-livre-dos-direitos-87911178.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Jazz' },
    update: {},
    create: {
      name: 'Jazz',
      imageUrl: 'https://www.gannett-cdn.com/-mm-/fe540925f187d73c8a91c93ece4e29936ea358fc/c=0-885-3804-3034/local/-/media/2015/07/16/MIGroup/Lansing/635726564289570272-ThinkstockPhotos-486813379-1-.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'MPB' },
    update: {},
    create: {
      name: 'MPB',
      imageUrl: 'https://mundodemusicas.com/wp-content/uploads/2016/12/musicos-brasileiros-post.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Bossa Nova' },
    update: {},
    create: {
      name: 'Bossa Nova',
      imageUrl: 'https://static.qobuz.com/images/covers/14/66/0841811136614_600.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Reggae' },
    update: {},
    create: {
      name: 'Reggae',
      imageUrl: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6C73/production/_104536772_bob_getty.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Country' },
    update: {},
    create: {
      name: 'Country',
      imageUrl: 'https://amtshows.com/wp-content/uploads/2017/12/all-about-country-music-spotlight-on-guitar-cowboy-boots-and-cowboy-hat.jpg',
    },
  });
  await prisma.category.upsert({
    where: { name: 'Outros' },
    update: {},
    create: {
      name: 'Outros',
      imageUrl: 'https://cdn.merriammusic.com/2022/04/Music-Lessons.jpg',
    },
  });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
