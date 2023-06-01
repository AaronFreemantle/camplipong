import { type User } from "@clerk/nextjs/dist/types/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return await clerkClient.users.getUserList({ limit: 100 });
    }),
    getAllWithMatches: publicProcedure.query(async ({ ctx }) => {
        const users = (await clerkClient.users.getUserList({ limit: 100 })) as (User & {
            matches: number;
            wins: number;
            losses: number;
        })[];
        const matches = await ctx.prisma.match.findMany();
        users.map((user) => {
            user.matches = matches.filter((match) => {
                return match.playerOneId === user.id || match.playerTwoId === user.id;
            }).length;
            user.wins = matches.filter((match) => {
                return (
                    (match.playerOneId === user.id && match.playerOneScore > match.playerTwoScore) ||
                    (match.playerTwoId === user.id && match.playerTwoScore > match.playerOneScore)
                );
            }).length;
            user.losses = matches.filter((match) => {
                return (
                    (match.playerOneId === user.id && match.playerOneScore < match.playerTwoScore) ||
                    (match.playerTwoId === user.id && match.playerTwoScore < match.playerOneScore)
                );
            }).length;
        });
        return users;
    }),
});
