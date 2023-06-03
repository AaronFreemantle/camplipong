import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { type Column, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";

export type UserStatistic = {
    id: string;
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
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        );
    };
}

export const columns = [
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

const Leaderboard = () => {
    const { data: users, isLoading, isError } = api.user.getAllWithMatches.useQuery();

    if (isLoading) {
        return <div>Loading</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    const tabledata = users.map((user) => {
        return {
            id: user.id,
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

    return (
        <div className="">
            <DataTable columns={columns} data={tabledata} defaultSort={[{ id: "elo", desc: true }]} />
        </div>
    );
};

export default Leaderboard;
