import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useWindowSize } from "~/lib/hooks";
import { Skeleton } from "./ui/skeleton";

const Leaderboard = () => {
    const { data: users, isLoading } = api.user.getAllWithMatches.useQuery();

    if (isLoading) {
        return <LeaderboardSkeleton />;
    }
    return (
        <section className="m-4">
            <h2 className="m-2 flex justify-center text-2xl">Leaderboard</h2>
            <Table>
                <LeaderboardTableHead />
                <TableBody>
                    {users
                        ?.sort((a, b) => Number(b.publicMetadata.elo ?? 0) - Number(a.publicMetadata.elo ?? 0))
                        .map((user) => {
                            const {
                                id,
                                firstName,
                                lastName,
                                username,
                                imageUrl,
                                matches,
                                wins,
                                losses,
                                winrate,
                                publicMetadata: { elo },
                            } = user;

                            return (
                                <LeaderboardRow
                                    key={id}
                                    firstName={firstName ?? ""}
                                    lastName={lastName ?? ""}
                                    username={username}
                                    imageUrl={imageUrl}
                                    matches={matches}
                                    wins={wins}
                                    losses={losses}
                                    winrate={winrate}
                                    elo={elo as number}
                                    champion={false}
                                />
                            );
                        })}
                </TableBody>
            </Table>
        </section>
    );
};

export default Leaderboard;

const LeaderboardRow = ({
    firstName,
    lastName,
    username,
    imageUrl,
    matches,
    wins,
    losses,
    winrate,
    elo,
}: {
    firstName: string;
    lastName: string;
    username: string | null;
    imageUrl: string;
    matches: number;
    wins: number;
    losses: number;
    winrate: number;
    elo: number;
    champion: boolean;
}) => {
    return (
        <TableRow>
            <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={imageUrl} alt={firstName ?? ""} />
                </Avatar>
                <p className="hidden sm:block">{username ? username : `${firstName} ${lastName}`}</p>
            </TableCell>
            <TableCell className="text-center">
                <p>{matches}</p>
            </TableCell>
            <TableCell className="text-center">
                <p>{wins}</p>
            </TableCell>
            <TableCell className="text-center">
                <p>{losses}</p>
            </TableCell>
            <TableCell className="text-center">
                <p>{winrate.toFixed(2)}%</p>
            </TableCell>
            <TableCell className="text-right">
                <p>{elo}</p>
            </TableCell>
        </TableRow>
    );
};

const LeaderboardTableHead = () => {
    const size = useWindowSize();
    return (
        <TableHeader>
            <TableRow>
                <TableHead>Player</TableHead>
                {size.width < 480 ? (
                    <>
                        <TableHead className="text-center">M</TableHead>
                        <TableHead className="text-center">W</TableHead>
                        <TableHead className="text-center">L</TableHead>
                        <TableHead className="text-center">W/L</TableHead>
                        <TableHead className="text-right">R</TableHead>
                    </>
                ) : (
                    <>
                        <TableHead className="text-center">Matches</TableHead>
                        <TableHead className="text-center">Wins</TableHead>
                        <TableHead className="text-center">Losses</TableHead>
                        <TableHead className="text-center">Win Rate</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                    </>
                )}
            </TableRow>
        </TableHeader>
    );
};

const LeaderboardSkeleton = () => {
    return (
        <section className="width-full m-4">
            <h2 className="m-2 flex justify-center text-2xl">Leaderboard</h2>
            <Table>
                <LeaderboardTableHead />
                <TableBody>
                    {[...(Array(10) as number[])].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="p-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-6" />
                                </div>
                            </TableCell>
                            <TableCell className="px-0 py-4 text-center">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-6" />
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-6" />
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-6" />
                                </div>
                            </TableCell>
                            <TableCell className="justify-end p-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};
