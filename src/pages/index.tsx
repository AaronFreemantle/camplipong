import { type NextPage } from "next";
import Head from "next/head";
import Leaderboard from "~/components/leaderboard";
import MatchList from "~/components/match-list";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta name="description" content="Camplify Ping Pong Leaderboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <div className="grid-cols-2 xl:grid">
                    <MatchList />
                    <Leaderboard />
                </div>
            </div>
        </>
    );
};

export default Home;
