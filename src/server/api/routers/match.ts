import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const matchRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.match.findMany();
    }),
});
