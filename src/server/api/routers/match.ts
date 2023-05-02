import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const matchRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.match.findMany();
    }),

    create: privateProcedure
        .input(
            z.object({
                playerTwoId: z.string(),
                playerOneScore: z.number(),
                playerTwoScore: z.number(),
                ranked: z.boolean().default(false),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { session } = ctx;

            console.log("Match created: ", input);
            const match = await ctx.prisma.match.create({
                data: {
                    playerOneId: session.userId,
                    ...input,
                },
            });

            return match;
        }),
});
