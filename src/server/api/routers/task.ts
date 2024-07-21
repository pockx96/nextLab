import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";



const tittleSchema = z.object({ title: z.string() });

const taskUpdateSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  done: z.boolean(),
});


export const taskRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.task.findMany();
  }),

  getOne: publicProcedure.input(tittleSchema).query(({ input, ctx }) => {
    return ctx.db.task.findUnique({
      where: {
        title: input.title,
      },
    });
  }),

  createTask: publicProcedure
    .input(z.object({ title: z.string().min(1) ,description: z.string().min(1)}))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          done:true,

        },
      });
    }),

  updateTask: publicProcedure
    .input(taskUpdateSchema)
    .mutation(({ input, ctx }) => {
      return ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: taskUpdateSchema.parse(input),
      });
    }),


  deleteTask: publicProcedure
    .input(z.object({ titleToDelete: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return await ctx.db.task.delete({
        where: {
          title: input.titleToDelete,
        },
      });
    }),
});
