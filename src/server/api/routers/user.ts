import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";



const idSchema = z.object({ id: z.number() });

const userUpdateSchema = z.object({
  id: z.number(),
  name: z.string(),
});


export const userRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  getOne: publicProcedure.input(idSchema).query(({ input, ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        id: input.id,
      },
    });
  }),

  createUser: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.user.create({
        data: {
          name: input.name,
        },
      });
    }),

  updateUser: publicProcedure
    .input(userUpdateSchema)
    .mutation(({ input, ctx }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: userUpdateSchema.parse(input),
      });
    }),


  deleteUser: publicProcedure
    .input(z.object({ nameToDelete: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return await ctx.db.user.delete({
        where: {
          name: input.nameToDelete,
        },
      });
    }),
});
