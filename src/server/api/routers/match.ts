import { clerkClient } from "@clerk/nextjs/server";
import { type Match } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const addUserDataToMatches = async (matches: Match[]) => {
    const playerOneIds = matches.map((match) => match.playerOneId);
    const playerTwoIds = matches.map((match) => match.playerTwoId);
    const users = await clerkClient.users.getUserList({
        userId: [...playerOneIds, ...playerTwoIds],
        limit: 110,
    });

    return matches.map((match) => {
        const playerOne = users.find((user) => user.id === match.playerOneId);
        const playerTwo = users.find((user) => user.id === match.playerTwoId);

        if (!playerOne || !playerTwo) {
            console.error("AUTHOR NOT FOUND", match);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Players for match not found. match ID: ${match.id}, USER IDS: ${match.playerOneId}, ${match.playerTwoId}`,
            });
        }
        return {
            match,
            players: {
                playerOne,
                playerTwo,
            },
        };
    });
};

export const matchRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return addUserDataToMatches(
            await ctx.prisma.match.findMany({
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
                take: 50,
            })
        );
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
