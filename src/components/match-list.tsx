import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { createColumnHelper, type Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DataTable } from "./ui/data-table";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

const MatchList = () => {
    const { data: matchesWithPlayers, isLoading, isError } = api.match.getAll.useQuery();

    if (isError) {
        return <div>Error</div>;
    }

    const tabledata = isLoading
        ? Array(10).fill({})
        : matchesWithPlayers?.map((data) => {
              const {
                  players: {
                      playerOne: {
                          username: playerOneUsername,
                          firstName: playerOneFirstName,
                          lastName: playerOneLastName,
                          imageUrl: playerOneImageUrl,
                      },
                      playerTwo: {
                          username: playerTwoUsername,
                          firstName: playerTwoFirstName,
                          lastName: playerTwoLastName,
                          imageUrl: playerTwoImageUrl,
                      },
                  },
                  match: { playerOneScore, playerOneDiff, playerTwoScore, playerTwoDiff },
              } = data;
              return {
                  date: new Date(data.match.createdAt),
                  playerOne: {
                      name: playerOneUsername ?? `${playerOneFirstName ?? ""} ${playerOneLastName ?? ""}`,
                      imageUrl: playerOneImageUrl,
                  },
                  playerOneScore,
                  playerOneRating: playerOneDiff,
                  playerTwo: {
                      name: playerTwoUsername ?? `${playerTwoFirstName ?? ""} ${playerTwoLastName ?? ""}`,
                      imageUrl: playerTwoImageUrl,
                  },
                  playerTwoScore,
                  playerTwoRating: playerTwoDiff,
              } satisfies MatchRow;
          });

    const tableColumns = isLoading ? skeleton : columns;

    return (
        <div className="">
            <DataTable columns={tableColumns} data={tabledata} />
        </div>
    );
};

export default MatchList;

type MatchRow = {
    date: Date;
    playerOne: {
        name: string;
        imageUrl: string;
    };
    playerOneScore: number;
    playerOneRating: number;
    playerTwo: {
        name: string;
        imageUrl: string;
    };
    playerTwoScore: number;
    playerTwoRating: number;
};

const columnHelper = createColumnHelper<MatchRow>();

function header(label: string) {
    return ({ column }: { column: Column<MatchRow> }) => {
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
    columnHelper.accessor("date", {
        header: header("Date"),
        cell: (props) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="text-center font-bold">
                            {props.getValue().toLocaleString("en", {
                                weekday: "short",
                                day: "numeric",
                                month: "numeric",
                            })}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-center font-bold">
                            {props.getValue().toLocaleString("en", {
                                weekday: "long",
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            })}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),
    columnHelper.accessor("playerOneRating", {
        header: header("Rating +/-"),
        cell: (props) => {
            const rating = props.getValue();
            return (
                <div className="text-center">
                    {rating >= 0 && <p className="font-bold text-ctp-green">+{rating}</p>}
                    {rating < 0 && <p className="font-bold text-ctp-red">{rating}</p>}
                </div>
            );
        },
    }),
    columnHelper.accessor("playerOne", {
        header: () => <div className="text-center">Player 1</div>,
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
    columnHelper.accessor("playerOneScore", {
        header: header("P1 Score"),
        cell: (props) => <div className="text-center font-bold">{props.getValue()}</div>,
    }),
    columnHelper.accessor("playerTwoScore", {
        header: header("P2 Score"),
        cell: (props) => <div className="text-center font-bold">{props.getValue()}</div>,
    }),
    columnHelper.accessor("playerTwo", {
        header: () => <div className="text-center">Player 2</div>,
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
    columnHelper.accessor("playerTwoRating", {
        header: header("Rating +/-"),
        cell: (props) => {
            const rating = props.getValue();
            return (
                <div className="text-center">
                    {rating >= 0 && <p className="font-bold text-ctp-green">+{rating}</p>}
                    {rating < 0 && <p className="font-bold text-ctp-red">{rating}</p>}
                </div>
            );
        },
    }),
];

const skeleton = [
    columnHelper.accessor("playerOneRating", {
        header: header("Rating +/-"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
    columnHelper.accessor("playerOne", {
        header: () => <div className="text-center">Player 1</div>,
        cell: () => (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
        ),
    }),
    columnHelper.accessor("playerOneScore", {
        header: header("P1 Score"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
    columnHelper.accessor("playerTwoScore", {
        header: header("P1 Score"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
    columnHelper.accessor("playerTwo", {
        header: () => <div className="text-center">Player 2</div>,
        cell: () => (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
        ),
    }),
    columnHelper.accessor("playerTwoRating", {
        header: header("Rating +/-"),
        cell: () => <Skeleton className="m-auto h-4 w-8" />,
    }),
];
