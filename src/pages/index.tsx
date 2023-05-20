import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import AddMatch from "~/components/AddMatch";
import Leaderboard from "~/components/Leaderboard";
import MatchList from "~/components/MatchList";

const Home: NextPage = () => {
    const user = useUser();

    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta name="description" content="Camplify Ping Pong Leaderboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {user.isSignedIn && <AddMatch />}
                <div className="grid-cols-2 xl:grid">
                    <MatchList />
                    <Leaderboard />
                </div>
            </main>
        </>
    );
};

export default Home;
