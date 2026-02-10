// src/server/services/StockService.ts

import { type PrismaClient, type Prisma } from "@prisma/client";

export class StockService {
  constructor(private prisma: PrismaClient) {}

  async reduceQuantity(stockId: number, amount: number) {
    return await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. 現在の在庫と閾値を取得
        const stock = await tx.stock.findUniqueOrThrow({
          where: { id: stockId },
        });
        const newQuantity = Math.max(0, stock.quantity - amount);

        // 2. 在庫を更新
        const updatedStock = await tx.stock.update({
          where: { id: stockId },
          data: { quantity: newQuantity },
        });

        // 3. 閾値を下回ったか判定
        if (newQuantity <= stock.threshold) {
          await tx.shoppingList.upsert({
            where: { itemId: stock.itemId },
            update: { isBought: false },
            create: { itemId: stock.itemId, quantity: 1, isBought: false },
          });
        }

        return updatedStock;
      }
    );
  }
}
