import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useWindowSize } from "~/lib/hooks";

const Leaderboard = () => {
    const { data: users } = api.user.getAllWithMatches.useQuery();
    const size = useWindowSize();
    return (
        <section className="m-4">
            <h2 className="m-2 flex justify-center text-2xl">Leaderboard</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>👑</TableHead>
                        <TableHead>Player</TableHead>
                        {size.width < 480 ? (
                            <>
                                <TableHead className="text-center">M</TableHead>
                                <TableHead className="text-center">W</TableHead>
                                <TableHead className="text-center">L</TableHead>
                                <TableHead className="text-center">R</TableHead>
                            </>
                        ) : (
                            <>
                                <TableHead>Matches</TableHead>
                                <TableHead>Wins</TableHead>
                                <TableHead>Losses</TableHead>
                                <TableHead>Rating</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users
                        ?.sort((a, b) => Number(b.publicMetadata.elo ?? 0) - Number(a.publicMetadata.elo ?? 0))
                        .map((user) => {
                            const {
                                id,
                                firstName,
                                lastName,
                                username,
                                profileImageUrl,
                                matches,
                                wins,
                                losses,
                                publicMetadata: { elo },
                            } = user;

                            return (
                                <LeaderboardRow
                                    key={id}
                                    firstName={firstName ?? ""}
                                    lastName={lastName ?? ""}
                                    username={username}
                                    profileImageUrl={profileImageUrl}
                                    matches={matches}
                                    wins={wins}
                                    losses={losses}
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
    profileImageUrl,
    matches,
    wins,
    losses,
    elo,
    champion,
}: {
    firstName: string;
    lastName: string;
    username: string | null;
    profileImageUrl: string;
    matches: number;
    wins: number;
    losses: number;
    elo: number;
    champion: boolean;
}) => {
    return (
        <TableRow>
            <TableCell>{champion ? "🏓" : ""}</TableCell>
            <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={profileImageUrl} alt={firstName ?? ""} />
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
            <TableCell className="text-right">
                <p>{elo}</p>
            </TableCell>
        </TableRow>
    );
};
