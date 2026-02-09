import { createTRPCRouter, publicProcedure } from "../trpc";
import { ItemService } from "../../services/ItemService";
import { z } from "zod";

export const itemRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ItemService(ctx.db).getAllItemsWithAlerts();
  }),

  locationList: publicProcedure.query(({ ctx }) => {
    return ctx.db.location.findMany({
      orderBy: { id: "asc" },
    });
  }),

  categoryList: publicProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany({
      orderBy: {id: "asc"},
    })
  }),

  reduce: publicProcedure
    .input(z.object({ stockId: z.number(), amount: z.number() }))
    .mutation(({ctx, input }) => {
      return ItemService(ctx.db).reduceStock(input.stockId, input.amount);
  }),

  add: publicProcedure
    .input(z.object({ stockId: z.number(), amount: z.number().positive() }))
    .mutation(({ ctx, input }) => {
      return ItemService(ctx.db).addStock(input.stockId, input.amount);
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      categoryId: z.number(),
      threshold: z.number().default(1),
      locationId: z.number().default(1)
    }))
    .mutation(({ctx, input}) => {
      return ItemService(ctx.db).createItem(input.name, input.categoryId, input.threshold, input.locationId);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ItemService(ctx.db).deleteItem(input.id);
    }),

  updateLocation: publicProcedure
    .input(z.object({ stockId: z.number(), locationId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ItemService(ctx.db).updateLocation(input.stockId, input.locationId);
      // return ItemService(ctx.db).updateLocation(input.stockId, input.locationId);
    }),
  
  updateThreshold: publicProcedure
    .input(z.object({ stockId: z.number(), threshold: z.number() }))
    .mutation(({ ctx, input }) => {
      return ItemService(ctx.db).updateThreshold(input.stockId, input.threshold);
    }),

  updatePurchaseFlag: publicProcedure
    .input(z.object({ itemId: z.number(), purchaseFlag: z.boolean()}))
    .mutation(({ ctx, input }) => {
      return ItemService(ctx.db).updatePurchaseFlag(input.itemId, input.purchaseFlag);
    })

});