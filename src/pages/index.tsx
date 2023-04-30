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

export default Home;
