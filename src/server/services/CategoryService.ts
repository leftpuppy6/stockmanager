// src/server/services/CategoryService.ts
import { type PrismaClient } from "@prisma/client";

export const CategoryService = (prisma: PrismaClient) => {
  return {
    async getAll() {
      return await prisma.category.findMany({
        orderBy: { id: "asc" },
        include: { _count: { select: { items: true } } },
      });
    },

    async updateName(id: number, name: string) {
      return await prisma.category.update({
        where: { id },
        data: { name },
      });
    },

    async create(name: string) {
      return await prisma.category.create({
        data: { name },
      });
    },

    async delete(id: number) {
      const count = await prisma.item.count({ where: { categoryId: id } });
      if (count > 0)
        throw new Error(
          "このカテゴリには商品が登録されているため削除できません"
        );
      return await prisma.category.delete({
        where: { id },
      });
    },
  };
};
