import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { type User } from "@clerk/nextjs/dist/api";
import { type Match } from "@prisma/client";

const MatchList = () => {
    const { data: matchesWithPlayers } = api.match.getAll.useQuery();
    return (
        <section className="width-full m-4">
            <h2 className="m-2 flex justify-center text-2xl">Recent Matches</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-1 text-center">Rating +/-</TableHead>
                        <TableHead className="p-1 text-center">Player 1</TableHead>
                        <TableHead className="p-1 text-center">P1 Score</TableHead>
                        <TableHead className="p-0 text-center"></TableHead>
                        <TableHead className="p-1 text-center">P2 Score</TableHead>
                        <TableHead className="p-1 text-center">Player 2</TableHead>
                        <TableHead className="p-1 text-center">Rating +/-</TableHead>
                        <TableHead className="p-1 text-center">Ranked</TableHead>
                    </TableRow>
                </TableHeader>
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
                {!match.ranked && <p>-</p>}
                {match.ranked && match.playerOneDiff >= 0 && <p className="text-ctp-green">+{match.playerOneDiff}</p>}
                {match.ranked && match.playerOneDiff < 0 && <p className="text-ctp-red">{match.playerOneDiff}</p>}
            </TableCell>
            <TableCell className="inline-table p-4">
                <div className="flex items-center gap-2 py-4 text-left">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={playerOne.profileImageUrl} alt={playerOne.firstName ?? ""} />
                    </Avatar>
                    <p>
                        {playerOne.firstName} {playerOne.lastName?.charAt(0)}
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
            <TableCell className="inline-table">
                <div className="flex items-center gap-2 py-4 text-right">
                    <p>
                        {playerTwo.firstName} {playerTwo.lastName?.charAt(0)}
                    </p>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={playerTwo.profileImageUrl} alt={playerTwo.firstName ?? ""} />
                    </Avatar>
                </div>
            </TableCell>
            <TableCell className="p-4 text-center font-bold">
                {!match.ranked && <p>-</p>}
                {match.ranked && match.playerTwoDiff >= 0 && <p className="text-ctp-green">+{match.playerTwoDiff}</p>}
                {match.ranked && match.playerTwoDiff < 0 && <p className="text-ctp-red">{match.playerTwoDiff}</p>}
            </TableCell>
            <TableCell className="p-4 text-center">
                <p>{match.ranked ? "Ranked" : "Casual"}</p>
            </TableCell>
        </TableRow>
    );
};
