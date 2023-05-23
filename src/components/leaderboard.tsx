import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

const Leaderboard = () => {
    const { data: users } = api.user.getAllWithMatches.useQuery();
    return (
        <section className="m-4">
            <h2 className="m-2 flex justify-center text-2xl">Leaderboard</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>👑</TableHead>
                        <TableHead>Player 1</TableHead>
                        <TableHead className="text-center">Matches</TableHead>
                        <TableHead className="text-center">Wins</TableHead>
                        <TableHead className="text-center">Losses</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
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
    profileImageUrl,
    matches,
    wins,
    losses,
    elo,
    champion,
}: {
    firstName: string;
    lastName: string;
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
                <p>
                    {firstName} {lastName}
                </p>
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
