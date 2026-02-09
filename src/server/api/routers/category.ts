    import { createTRPCRouter, publicProcedure } from "../trpc";
    import { CategoryService } from "../../services/CategoryService";
    import { z } from "zod";

export const categoryRouter = createTRPCRouter({
    list: publicProcedure.query(({ ctx }) => {
    return CategoryService(ctx.db).getAll();
    }),

    create: publicProcedure
        .input(z.object({ name:z.string() }))
        .mutation(({ ctx, input }) => {
            return CategoryService(ctx.db).create(input.name);
    }),

    update: publicProcedure
        .input(z.object({ id:z.number(), name:z.string() }))
        .mutation(({ ctx, input }) => {
            return CategoryService(ctx.db).updateName(input.id, input.name);
    }),

    delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
        return CategoryService(ctx.db).delete(input.id);
    })

});