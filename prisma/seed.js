// Import Prisma's Client 
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
// Hash password
const bcrypt = require("bcryptjs");

async function main() {
  // Create author and user
  const hashPassword = await bcrypt.hash("letmein", 9);
  const mingau = await prisma.author.create({
    data: {
      firstName: "Mingau",
      lastName: "Miau",
      email: "mingaumiau@miar.nyan",
      password: hashPassword,
      bio: 'Olá, humanos!\n\nMeu nome é Mingau, mas também atendo por \"pspspsps\" e \"minguê\". Sou um gato preto de aproximadamente 7 anos (não sei ao certo, minha certidão de nascimento era um papelão no fundo de uma caçamba de lixo).\n\nCheguei neste blog da mesma forma que cheguei na minha casa: de repente e sem pedir licença. Agora ninguém me tira daqui!\n\nHoje, vivo entre teclados, cobertores e uma humana que acha que manda em mim. Deixo ela acreditar nisso — afinal, quem abre os potes de ração sou eu? Não. Mas quem mia até ela abrir? Exato.',
    }
  });
  const gatito = await prisma.visitor.create({
    data: {
      username: "um_gatito",
      email: "gatito@miar.nyan",
      password: hashPassword,
    },
  });

  // Create post
  const firstPost = await prisma.post.create({
    data: {
      title: "Meu primeiro post!",
      content: "Primeiro post do blog xD",
      published: true,
      authorId: mingau.id,
      createdAt: new Date("2025-11-25T22:11:53.318Z"),
    },
  });

  // Create comment
  await prisma.comment.create({
    data: {
      postId: firstPost.id,
      usernameId: gatito.id,
      content: "meeeeeeowwwww",
    },
  });

  // Seed?
  console.log("Seeding database!!!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    process.exit(1);
  });