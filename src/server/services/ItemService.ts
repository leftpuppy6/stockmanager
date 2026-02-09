// src/server/services/ItemService.ts
import { type PrismaClient } from "@prisma/client";

export const ItemService = (prisma: PrismaClient) => {
  return {
    async getAllItemsWithAlerts() {
      const items = await prisma.item.findMany({
        include: { 
          stocks: {
            include: { 
              storage: true
            }
          } 
        },
      });
      return items.map((item) => {
        const totalStock = item.stocks.reduce((sum, s) => sum + s.quantity, 0);
        const threshold = item.stocks[0]?.threshold ?? 0;

        return {
          ...item,
          totalStock,
          isAlert: totalStock <= threshold,
        };
      });
    },

    async reduceStock(stockId: number, amount: number) {
      const currentStock = await prisma.stock.findUnique({
        where: { id: stockId },
      });

      if (!currentStock) {
        throw new Error("在庫データが見つかりません");
      }

      if (amount < 1) {
        throw new Error("正の値を入力してください")
      }

      const newQuantity = currentStock.quantity - amount;

      if (newQuantity < 0) {
        throw new Error("在庫0未満エラー");
      }
      return await prisma.stock.update({
        where: { id: stockId },
        data: {
          quantity: newQuantity,
        }
      })
    },

    async addStock(stockId: number, amount: number) {
      if (amount <= 0) throw new Error("数量は1以上を指定してください");

      return await prisma.stock.update({
        where: { id: stockId },
        data: { quantity: { increment: amount } ,}
      });
    },

async createItem(name: string, categoryId: number, threshold: number, locationId = 1) {
  return await prisma.item.create({
    data: {
      name: name,
      category: {
        connectOrCreate: {
          where: { id: categoryId },
          create: { name: "未分類" }
        }
      },
      stocks: {
        create: {
          quantity: 0,
          threshold: threshold,
          locationId: locationId,
        },
      },
    },
  });
},
    async deleteItem(id: number) {
      return await prisma.item.delete({
        where: { id },
      });
    },

    async updateLocation(stockId: number, newLocationId: number) {
      return await prisma.stock.update({
        where: { id: stockId },
        data: { locationId: newLocationId },
      })
    },

    async updateThreshold(stockId: number, threshold: number) {
      if (threshold < 0) throw new Error("しきい値は0以上");

      return await prisma.stock.update({
        where: { id: stockId },
        data: { threshold: threshold },
      })
    },

    async updatePurchaseFlag(itemId: number, purchaseFlag: boolean) {
      return await prisma.item.update({
        where: { id: itemId },
        data: { purchaseFlag: purchaseFlag }
      })
    }
  };
};

export type ItemWithAlerts = Awaited<
  ReturnType<ReturnType<typeof ItemService>["getAllItemsWithAlerts"]>
>[number];