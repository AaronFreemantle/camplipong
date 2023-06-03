import { type NextPage } from "next";
import Head from "next/head";
import AddMatch from "~/components/add-match";
import Leaderboard from "~/components/leaderboard";
import MatchList from "~/components/match-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Camplipong</title>
                <meta name="description" content="Camplify Ping Pong Leaderboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Tabs defaultValue="leaderboard" className="flex flex-col md:items-center">
                <TabsList className="m-auto w-min">
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                    <TabsTrigger value="matches">Matches</TabsTrigger>
                </TabsList>
                <TabsContent value="leaderboard" className="md:w-9/12">
                    <Leaderboard />
                </TabsContent>
                <TabsContent value="matches" className="md:w-9/12">
                    <AddMatch />
                    <MatchList />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Home;
