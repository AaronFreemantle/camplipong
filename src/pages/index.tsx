import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";

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
            <form onSubmit={handleSubmit}>
                <Avatar>
                    <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.firstName ?? ""} />
                </Avatar>
                <label>Your Score</label>
                <input type="number" inputMode="numeric" onChange={(e) => setPlayerOneScore(+e.target.value)} />
                <label>Opponent</label>
                <select defaultValue="" placeholder="Select an Opponent" onChange={(e) => setOpponent(e.target.value)}>
                    <option value="" disabled>
                        Select an Opponent
                    </option>
                    {users?.map((user) => {
                        if (user.id === currentUser.id) return null;
                        return (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                            </option>
                        );
                    })}
                </select>
                <label>{`Opponent's Score`}</label>
                <input type="number" inputMode="numeric" onChange={(e) => setPlayerTwoScore(+e.target.value)} />
                <input type="submit" value="Submit" />
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
