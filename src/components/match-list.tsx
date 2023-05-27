import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { type User } from "@clerk/nextjs/dist/types/server";
import { type Match } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

const MatchList = () => {
    const { data: matchesWithPlayers, isLoading } = api.match.getAll.useQuery();

    if (isLoading) {
        return <MatchListSkeleton />;
    }

    return (
        <section className="width-full m-4">
            <h2 className="m-2 flex justify-center text-2xl">Recent Matches</h2>
            <Table>
                <MatchTableHead />
                <TableBody>
                    {matchesWithPlayers?.map((matchWithPlayers) => {
                        const {
                            match,
                            players: { playerOne, playerTwo },
                        } = matchWithPlayers;

                        return <MatchRow key={match.id} match={match} playerOne={playerOne} playerTwo={playerTwo} />;
                    })}
                </TableBody>
            </Table>
        </section>
    );
};

export default MatchList;

const MatchRow = ({ match, playerOne, playerTwo }: { match: Match; playerOne: User; playerTwo: User }) => {
    return (
        <TableRow>
            <TableCell className="p-4 text-center font-bold">
                {match.playerOneDiff >= 0 && <p className="text-ctp-green">+{match.playerOneDiff}</p>}
                {match.playerOneDiff < 0 && <p className="text-ctp-red">{match.playerOneDiff}</p>}
            </TableCell>
            <TableCell className="p-4">
                <div className="flex items-center gap-2 text-left">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={playerOne.profileImageUrl} alt={playerOne.firstName ?? ""} />
                    </Avatar>
                    <p className="hidden sm:block">
                        {playerOne.username
                            ? playerOne.username
                            : `${playerOne.firstName ?? ""} ${playerOne.lastName ?? ""}`}
                    </p>
                </div>
            </TableCell>
            <TableCell className="py-4 text-center font-bold">
                <p>{match.playerOneScore}</p>
            </TableCell>
            <TableCell className="px-0 py-4 text-center">
                <p>vs</p>
            </TableCell>
            <TableCell className="py-4 text-center font-bold">
                <p>{match.playerTwoScore}</p>
            </TableCell>
            <TableCell className="justify-end p-4">
                <div className="flex items-center justify-end gap-2 text-right">
                    <p className="hidden sm:block">
                        {playerTwo.username
                            ? playerTwo.username
                            : `${playerTwo.firstName ?? ""} ${playerTwo.lastName ?? ""}`}
                    </p>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={playerTwo.profileImageUrl} alt={playerTwo.firstName ?? ""} />
                    </Avatar>
                </div>
            </TableCell>
            <TableCell className="p-4 text-center font-bold">
                {match.playerTwoDiff >= 0 && <p className="text-ctp-green">+{match.playerTwoDiff}</p>}
                {match.playerTwoDiff < 0 && <p className="text-ctp-red">{match.playerTwoDiff}</p>}
            </TableCell>
        </TableRow>
    );
};

const MatchTableHead = () => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="p-1 text-center">Rating +/-</TableHead>
                <TableHead className="p-1 px-4 text-left">Player 1</TableHead>
                <TableHead className="p-1 text-center">P1 Score</TableHead>
                <TableHead className="p-0 text-center"></TableHead>
                <TableHead className="p-1 text-center">P2 Score</TableHead>
                <TableHead className="p-1 px-4 text-right">Player 2</TableHead>
                <TableHead className="p-1 text-center">Rating +/-</TableHead>
            </TableRow>
        </TableHeader>
    );
};

const MatchListSkeleton = () => {
    return (
        <section className="width-full m-4">
            <h2 className="m-2 flex justify-center text-2xl">Recent Matches</h2>
            <Table>
                <MatchTableHead />
                <TableBody>
                    {[...(Array(10) as number[])].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="p-2">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-6 bg-ctp-green" />
                                </div>
                            </TableCell>
                            <TableCell className="p-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-center font-bold">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            </TableCell>
                            <TableCell className="px-0 py-4 text-center">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-4" />
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-center font-bold">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            </TableCell>
                            <TableCell className="justify-end p-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </TableCell>
                            <TableCell className="p-2 text-center font-bold">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-6 bg-ctp-red" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};
