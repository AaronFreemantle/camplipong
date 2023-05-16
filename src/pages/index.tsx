import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

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
                <div>
                    <MatchList />
                    {/* <LeaderBoard /> */}
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

    if (!isSignedIn) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!opponent || !playerOneScore || !playerTwoScore) return;
        createMatch({
            playerTwoId: opponent,
            playerOneScore,
            playerTwoScore,
        });
    };

    return (
        <section className="m-2">
            <h2 className="flex justify-center text-2xl">Add Match</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                <div className="w-full items-center gap-1.5">
                    <label>Your Score</label>
                    <Input type="number" inputMode="numeric" onChange={(e) => setPlayerOneScore(+e.target.value)} />
                </div>
                <div className="w-full items-center gap-1.5">
                    <label>{`Opponent's Score`}</label>
                    <Input type="text" inputMode="numeric" onChange={(e) => setPlayerTwoScore(+e.target.value)} />
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
        <section className="m-2">
            <h2 className="flex justify-center text-2xl">Match List</h2>
            {matchesWithPlayers?.map((matchWithPlayers) => {
                const {
                    match,
                    players: { playerOne, playerTwo },
                } = matchWithPlayers;

                return (
                    <div key={match.id}>
                        {playerOne.firstName} {playerOne.lastName} {match.playerOneScore}
                        {playerTwo.firstName} {playerTwo.lastName} {match.playerTwoScore}
                    </div>
                );
            })}
        </section>
    );
};

export default Home;
