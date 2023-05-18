import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent } from "~/components/ui/card";
import { type User } from "@clerk/nextjs/dist/api";
import { type Match } from "@prisma/client";

const Home: NextPage = () => {
    const user = useUser();

    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta name="description" content="dark" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="md:w-max-screen-lg bg-mauve-300 flex flex-col items-center md:mx-auto md:my-0">
                {user.isSignedIn && <AddMatch />}
                <div className="grid-cols-2 xl:grid">
                    <MatchList />
                    <LeaderBoard />
                </div>
            </main>
        </>
    );
};

const AddMatch = () => {
    const { user: currentUser, isSignedIn } = useUser();

    const { data: users } = api.user.getAll.useQuery();
    const ctx = api.useContext();
    const { mutate: createMatch } = api.match.create.useMutation({
        onSuccess: () => {
            void ctx.match.getAll.invalidate();
        },
    });

    const [opponent, setOpponent] = useState("");
    const [playerOneScore, setPlayerOneScore] = useState<number>();
    const [playerTwoScore, setPlayerTwoScore] = useState<number>();
    const [ranked, setRanked] = useState(false);

    if (!isSignedIn) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!opponent || !playerOneScore || !playerTwoScore) return;
        createMatch({
            playerTwoId: opponent,
            playerOneScore,
            playerTwoScore,
            ranked,
        });
    };

    return (
        <section className="m-2">
            <h2 className="flex justify-center text-2xl">Add Match</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                <div className="w-full items-center gap-1.5">
                    <Label htmlFor="yourScore">Your Score</Label>
                    <Input
                        id="yourScore"
                        type="number"
                        inputMode="numeric"
                        onChange={(e) => setPlayerOneScore(+e.target.value)}
                    />
                </div>
                <div className="w-full items-center gap-1.5">
                    <Label htmlFor="opponentScore">{`Opponent's Score`}</Label>
                    <Input
                        id="opponentScore"
                        type="number"
                        inputMode="numeric"
                        onChange={(e) => setPlayerTwoScore(+e.target.value)}
                    />
                </div>
                <Select onValueChange={(value) => setOpponent(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an Opponent" />
                    </SelectTrigger>
                    <SelectContent>
                        {users?.map((user) => {
                            if (user.id === currentUser.id) return null;
                            return (
                                <SelectItem key={user.id} value={user.id}>
                                    <div className="flex flex-row items-center justify-center gap-1">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.profileImageUrl} alt={user.firstName ?? ""} />
                                        </Avatar>
                                        {user.firstName} {user.lastName}
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                    <Switch id="ranked" onCheckedChange={(checked) => setRanked(checked)} />
                    <Label htmlFor="ranked">Ranked</Label>
                </div>
                <Button type="submit" value="Submit">
                    Submit
                </Button>
            </form>
        </section>
    );
};

const MatchList = () => {
    const { data: matchesWithPlayers } = api.match.getAll.useQuery();
    return (
        <section className="m-4">
            <h2 className="m-2 flex justify-center text-2xl">Recent Matches</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rating +/-</TableHead>
                        <TableHead>Player 1</TableHead>
                        <TableHead>P1 Score</TableHead>
                        <TableHead></TableHead>
                        <TableHead>P2 Score</TableHead>
                        <TableHead>Player 2</TableHead>
                        <TableHead>Rating +/-</TableHead>
                        <TableHead>Ranked</TableHead>
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

const MatchRow = ({ match, playerOne, playerTwo }: { match: Match; playerOne: User; playerTwo: User }) => {
    return (
        <TableRow className="bg-background">
            <TableCell className="text-center">
                {!match.ranked && <p>-</p>}
                {match.playerOneDiff >= 0 && <p className="text-green-500">+{match.playerOneDiff}</p>}
                {match.playerOneDiff < 0 && <p className="text-red-500">{match.playerOneDiff}</p>}
            </TableCell>
            <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={playerOne.profileImageUrl} alt={playerOne.firstName ?? ""} />
                </Avatar>
                <p>
                    {playerOne.firstName} {playerOne.lastName}
                </p>
            </TableCell>
            <TableCell className="text-center">
                <p>{match.playerOneScore}</p>
            </TableCell>
            <TableCell className="">
                <p>vs</p>
            </TableCell>
            <TableCell className="text-center">
                <p>{match.playerTwoScore}</p>
            </TableCell>
            <TableCell className="flex items-center gap-2">
                <p>
                    {playerTwo.firstName} {playerTwo.lastName}
                </p>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={playerTwo.profileImageUrl} alt={playerTwo.firstName ?? ""} />
                </Avatar>
            </TableCell>
            <TableCell className="text-center">
                {!match.ranked && <p>-</p>}
                {match.playerTwoDiff >= 0 && <p className="text-green-500">+{match.playerTwoDiff}</p>}
                {match.playerTwoDiff < 0 && <p className="text-red-500">{match.playerTwoDiff}</p>}
            </TableCell>
            <TableCell className="">
                <p>{match.ranked ? "Ranked" : "Casual"}</p>
            </TableCell>
        </TableRow>
    );
};

const LeaderBoard = () => {
    const { data: users } = api.user.getAll.useQuery();
    return (
        <section className="m-4">
            <h2 className="m-2 flex justify-center text-2xl">LeaderBoard</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Player 1</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users
                        ?.sort((a, b) => Number(b.publicMetadata.elo) - Number(a.publicMetadata.elo))
                        .map((user) => {
                            const {
                                id,
                                firstName,
                                lastName,
                                profileImageUrl,
                                publicMetadata: { elo },
                            } = user;

                            return (
                                <LeaderBoardRow
                                    key={id}
                                    id={id}
                                    firstName={firstName ?? ""}
                                    lastName={lastName ?? ""}
                                    profileImageUrl={profileImageUrl}
                                    elo={elo as number}
                                />
                            );
                        })}
                </TableBody>
            </Table>
        </section>
    );
};

const LeaderBoardRow = ({
    id,
    firstName,
    lastName,
    profileImageUrl,
    elo,
}: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    elo: number;
}) => {
    return (
        <TableRow className="bg-background">
            <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={profileImageUrl} alt={firstName ?? ""} />
                </Avatar>
                <p>
                    {firstName} {lastName}
                </p>
            </TableCell>
            <TableCell className="text-right">
                <p>{elo}</p>
            </TableCell>
        </TableRow>
    );
};
export default Home;
