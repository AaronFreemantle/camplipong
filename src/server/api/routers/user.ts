import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return await clerkClient.users.getUserList();
    }),
});
