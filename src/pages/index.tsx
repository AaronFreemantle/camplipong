import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
    const user = useUser();
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
        </>
    );
};

export default Home;
