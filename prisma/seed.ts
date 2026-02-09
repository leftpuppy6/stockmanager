import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const locations = ["冷蔵庫", "冷凍庫", "パントリー", "日用品", "洗面所", "トイレ", "その他"];
  for (const name of locations) {
    await prisma.location.upsert({
      where: { name },
      update: { },
      create: { name },
    })
  }

const categories = ["野菜", "調味料", "日用品", "その他"];

const tasks = categories.map((name) => 
  prisma.category.upsert({
    where: { name: name }, // 名前が一致するものを探す
    update: {},            // 既にあるなら何もしない（名前が変わらないので）
    create: { name: name }, // なければ作成。IDは自動採番（1, 2, 3...）に任せる
  })
);

// 全ての処理を並列で実行し、全て終わるのを待つ（爆速です）
await Promise.all(tasks);



  console.log("Seed data created!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());