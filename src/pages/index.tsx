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
    const { mutate: createMatch } = api.match.create.useMutation();

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
                        type="text"
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
            {matchesWithPlayers?.map((matchWithPlayers) => {
                const {
                    match,
                    players: { playerOne, playerTwo },
                } = matchWithPlayers;

                return <MatchCard key={match.id} match={match} playerOne={playerOne} playerTwo={playerTwo} />;
            })}
        </section>
    );
};

const MatchCard = ({ match, playerOne, playerTwo }: { match: Match; playerOne: User; playerTwo: User }) => {
    return (
        <Card className="bg-background">
            <CardContent className="p-4">
                <ul className="grid grid-cols-12 gap-3">
                    <li className="justify-left col-span-4 flex flex-row items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={playerOne.profileImageUrl} alt={playerOne.firstName ?? ""} />
                        </Avatar>
                        <p>
                            {playerOne.firstName} {playerOne.lastName}
                        </p>
                        <p>{match.playerOneScore}</p>
                    </li>
                    <li className="col-span-1 flex justify-center">
                        <p>vs</p>
                    </li>
                    <li className="justify-left col-span-4 flex flex-row items-center gap-3">
                        <p>{match.playerTwoScore}</p>
                        <p>
                            {playerTwo.firstName} {playerTwo.lastName}
                        </p>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={playerTwo.profileImageUrl} alt={playerTwo.firstName ?? ""} />
                        </Avatar>
                    </li>
                    <li className="col-span-3 flex flex-row items-center justify-center">
                        <p>{match.ranked ? "Ranked" : "Casual"}</p>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
};

const LeaderBoard = () => {
    return (
        <section className="m-2">
            <h2 className="m-2 flex justify-center text-2xl">Leaderboard</h2>
            <Table></Table>
        </section>
    );
};
export default Home;
