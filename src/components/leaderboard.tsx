import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { type Column, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "./ui/skeleton";

const Leaderboard = () => {
    const { data: users, isLoading, isError } = api.user.getAllWithMatches.useQuery();

    if (isError) {
        return <div>Error</div>;
    }

    const tabledata = isLoading
        ? Array(10).fill({})
        : users?.map((user) => {
              return {
                  player: {
                      name: user.username ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`,
                      imageUrl: user.imageUrl,
                  },
                  matches: user.matches,
                  wins: user.wins,
                  losses: user.losses,
                  winrate: user.winrate,
                  elo: (user.publicMetadata.elo as number) ?? 0,
              } satisfies UserStatistic;
          });

    const tableColumns = isLoading ? skeleton : columns;

    return (
        <div className="">
            <DataTable columns={tableColumns} data={tabledata} defaultSort={[{ id: "elo", desc: true }]} />
        </div>
    );
};

export default Leaderboard;

type UserStatistic = {
    player: {
        name: string;
        imageUrl: string;
    };
    matches: number;
    wins: number;
    losses: number;
    winrate: number;
    elo: number;
};

const columnHelper = createColumnHelper<UserStatistic>();

function header(label: string) {
    return ({ column }: { column: Column<UserStatistic> }) => {
        return (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    {label}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        );
    };
}

const columns = [
    columnHelper.accessor("player", {
        header: header("Player"),
        cell: (props) => {
            const { name, imageUrl } = props.getValue();

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={imageUrl} alt={name} />
                    </Avatar>
                    <p className="">{name}</p>
                </div>
            );
        },
    }),
    columnHelper.accessor("matches", {
        header: header("Matches"),
        cell: (props) => <div className="text-center">{props.getValue()}</div>,
    }),
    columnHelper.accessor("wins", {
        header: header("Wins"),
        cell: (props) => <div className="text-center">{props.getValue()}</div>,
    }),
    columnHelper.accessor("losses", {
        header: header("Losses"),
        cell: (props) => <div className="text-center">{props.getValue()}</div>,
    }),
    columnHelper.accessor("winrate", {
        header: header("Winrate"),
        cell: (props) => <div className="text-center">{props.getValue().toFixed(2) + "%"}</div>,
    }),
    columnHelper.accessor("elo", {
        header: header("Rating"),
        cell: (props) => <div className="text-center">{props.getValue()}</div>,
    }),
];

const skeleton = [
    columnHelper.accessor("player", {
        header: header("Player"),
        cell: () => (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
        ),
    }),
    columnHelper.accessor("matches", {
        header: header("Matches"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
    columnHelper.accessor("wins", {
        header: header("Wins"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
    columnHelper.accessor("losses", {
        header: header("Losses"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
    columnHelper.accessor("winrate", {
        header: header("Winrate"),
        cell: () => <Skeleton className="m-auto h-4 w-16" />,
    }),
    columnHelper.accessor("elo", {
        header: header("Rating"),
        cell: () => <Skeleton className="m-auto h-4 w-16" />,
    }),
];
