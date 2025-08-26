import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const categories = [
    { name: "Fumaças", slug: "fumaças", restricted: true },
    { name: "Moda Feminina", slug: "moda-feminina" },
    { name: "Moda Masculina", slug: "moda-masculina" },
    { name: "Autos", slug: "autos" },
    { name: "Motos", slug: "motos" },
    { name: "Eletrodomésticos", slug: "eletrodomesticos" },
  ];

  const createdCats = [];
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...c,
        theme: { color: "#0ea5a4" },
      },
    });
    createdCats.push(cat);
  }

  // create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash: "", // set via env or manual later
    },
  });

  // Create 10 products per category (60 total)
  for (const cat of createdCats) {
    for (let i = 1; i <= 10; i++) {
      const sku = `${cat.slug.toUpperCase().slice(0,3)}-${i}`;
      await prisma.product.create({
        data: {
          categoryId: cat.id,
          title: `${cat.name} Produto ${i}`,
          description: `Descrição do produto ${i} da categoria ${cat.name}`,
          sku,
          brand: "Marca Exemplo",
          model: `Model ${i}`,
          colorOptions: ["Preto", "Branco"],
          sizeOptions: ["P", "M", "G"],
          images: [
            `https://picsum.photos/seed/${sku}/800/800`,
            `https://picsum.photos/seed/${sku}-2/800/800`,
          ],
          price: Math.round((50 + Math.random() * 500) * 100) / 100,
          compareAtPrice: Math.random() > 0.7 ? Math.round((100 + Math.random() * 600) * 100) / 100 : null,
          stock: Math.floor(Math.random() * 100),
          attributes: { weight: "1kg" },
          isHot: Math.random() > 0.8,
        },
      });
    }
  }

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
