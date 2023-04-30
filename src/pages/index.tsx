import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
    const user = useUser();

    const { data } = api.match.getAll.useQuery();
    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta
                    name="description"
                    content="Camplify Ping Pong Leaderboard"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>{!user.isSignedIn ? <SignInButton /> : <SignOutButton />}</div>
            {user.isSignedIn && <RecordMatch />}
            <div>
                {data?.map((match) => (
                    <div key={match.id}>
                        {match.playerOneId} {match.playerTwoId}
                    </div>
                ))}
            </div>
        </>
    );
};

const RecordMatch = () => {
    const { user } = useUser();
    const { data: users } = api.user.getAll.useQuery();

    if (!user) return null;

    return (
        <div>
            <form>
                <label>Opponent</label>
                <select placeholder="Select an Opponent">
                    <option value="" disabled selected>
                        Select an Opponent
                    </option>
                    {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
                <label>Your Score</label>
                <input />
                <label>{`Opponent's Score`}</label>
                <input />
            </form>
        </div>
    );
};

export default Home;
