import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

const Home: NextPage = () => {
    const user = useUser();

    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta name="description" content="Camplify Ping Pong Leaderboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {!user.isSignedIn ? <SignInButton /> : <SignOutButton />}
            {user.isSignedIn && <AddMatch />}
            <MatchList />
        </>
    );
};

const AddMatch = () => {
    const { data: users } = api.user.getAll.useQuery();
    const { mutate: createMatch } = api.match.create.useMutation();

    const [opponent, setOpponent] = useState("");
    const [playerOneScore, setPlayerOneScore] = useState<number>();
    const [playerTwoScore, setPlayerTwoScore] = useState<number>();

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
        <div>
            <form onSubmit={handleSubmit}>
                <label>Opponent</label>
                <select defaultValue="" placeholder="Select an Opponent" onChange={(e) => setOpponent(e.target.value)}>
                    <option value="" disabled>
                        Select an Opponent
                    </option>
                    {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
                <label>Your Score</label>
                <input type="number" inputMode="numeric" onChange={(e) => setPlayerOneScore(+e.target.value)} />
                <label>{`Opponent's Score`}</label>
                <input type="number" inputMode="numeric" onChange={(e) => setPlayerTwoScore(+e.target.value)} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

const MatchList = () => {
    const { data: matches } = api.match.getAll.useQuery();
    return (
        <>
            {matches?.map((match) => (
                <div key={match.id}>
                    {match.playerOneId} {match.playerOneScore}
                    {match.playerTwoId} {match.playerTwoScore}
                </div>
            ))}
        </>
    );
};

export default Home;
