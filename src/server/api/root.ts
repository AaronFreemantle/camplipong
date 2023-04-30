import { createTRPCRouter } from "~/server/api/trpc";
import { matchRouter } from "~/server/api/routers/match";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    match: matchRouter,
    user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
