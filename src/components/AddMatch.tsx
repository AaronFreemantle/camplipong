import { useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

const AddMatch = () => {
    const { user: currentUser, isSignedIn } = useUser();

    const { data: users } = api.user.getAll.useQuery();
    const ctx = api.useContext();
    const { mutate: createMatch } = api.match.create.useMutation({
        onSuccess: () => {
            void ctx.match.getAll.invalidate();
            void ctx.user.getAll.invalidate();
        },
    });

    const [opponent, setOpponent] = useState("");
    const [playerOneScore, setPlayerOneScore] = useState<number>();
    const [playerTwoScore, setPlayerTwoScore] = useState<number>();
    const [ranked, setRanked] = useState(false);

    if (!isSignedIn) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!opponent || !playerOneScore || !playerTwoScore) return;
        createMatch({
            playerTwoId: opponent,
            playerOneScore,
            playerTwoScore,
            ranked,
        });
    };

    return (
        <section className="m-2">
            <h2 className="flex justify-center text-2xl">Add Match</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                <div className="w-full items-center gap-1.5">
                    <Label htmlFor="yourScore">Your Score</Label>
                    <Input
                        id="yourScore"
                        type="number"
                        inputMode="numeric"
                        onChange={(e) => setPlayerOneScore(+e.target.value)}
                    />
                </div>
                <div className="w-full items-center gap-1.5">
                    <Label htmlFor="opponentScore">{`Opponent's Score`}</Label>
                    <Input
                        id="opponentScore"
                        type="number"
                        inputMode="numeric"
                        onChange={(e) => setPlayerTwoScore(+e.target.value)}
                    />
                </div>
                <Select onValueChange={(value) => setOpponent(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an Opponent" />
                    </SelectTrigger>
                    <SelectContent>
                        {users?.map((user) => {
                            if (user.id === currentUser.id) return null;
                            return (
                                <SelectItem key={user.id} value={user.id}>
                                    <div className="flex flex-row items-center justify-center gap-1">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.profileImageUrl} alt={user.firstName ?? ""} />
                                        </Avatar>
                                        {user.firstName} {user.lastName}
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                    <Switch id="ranked" onCheckedChange={(checked) => setRanked(checked)} />
                    <Label htmlFor="ranked">Ranked</Label>
                </div>
                <Button type="submit" value="Submit">
                    Submit
                </Button>
            </form>
        </section>
    );
};

export default AddMatch;
