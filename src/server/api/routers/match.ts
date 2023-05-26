import { clerkClient } from "@clerk/nextjs/server";
import { type Match } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { calculateEloDiff } from "~/utils/elo";

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
                ranked: z.boolean().default(true),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { session } = ctx;

            let playerOneDiff = 0;
            let playerTwoDiff = 0;

            if (input.ranked) {
                const playerOne = await clerkClient.users.getUser(session.userId);
                const playerTwo = await clerkClient.users.getUser(input.playerTwoId);

                const diffs = calculateEloDiff(
                    (playerOne.publicMetadata.elo as number) || 1000,
                    (playerTwo.publicMetadata.elo as number) || 1000,
                    input.playerOneScore,
                    input.playerTwoScore
                );

                playerOneDiff = diffs.playerOneDiff;
                playerTwoDiff = diffs.playerTwoDiff;

                await clerkClient.users.updateUser(playerOne.id, {
                    publicMetadata: {
                        elo: ((playerOne.publicMetadata.elo as number) || 1000) + playerOneDiff,
                    },
                });
                await clerkClient.users.updateUser(playerTwo.id, {
                    publicMetadata: {
                        elo: ((playerTwo.publicMetadata.elo as number) || 1000) + playerTwoDiff,
                    },
                });
            }

            console.log("Match created: ", input);
            const match = await ctx.prisma.match.create({
                data: {
                    playerOneId: session.userId,
                    playerOneDiff,
                    playerTwoDiff,
                    ...input,
                },
            });

            return match;
        }),
});
