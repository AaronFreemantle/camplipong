import { useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/form";

const formSchema = z.object({
    playerOneScore: z.coerce.number().min(0).max(21),
    playerTwoScore: z.coerce.number().min(0).max(21),
    playerTwoId: z.string(),
    ranked: z.boolean(),
});

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    if (!isSignedIn) return null;

    function onSubmit(values: z.infer<typeof formSchema>) {
        createMatch({
            ...values,
        });
    }
    return (
        <section className="m-2">
            {" "}
            <h2 className="flex justify-center text-2xl">Add Match</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
                    <FormField
                        control={form.control}
                        name="playerOneScore"
                        render={({ field }) => (
                            <FormItem className="w-full items-center gap-1.5">
                                <FormLabel htmlFor="playerOneScore">Your Score</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="playerTwoScore"
                        render={({ field }) => (
                            <FormItem className="w-full items-center gap-1.5">
                                <FormLabel htmlFor="playerTwoScore">{`Opponent's Score`}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="playerTwoId"
                        render={({ field }) => (
                            <FormItem className="w-full items-center gap-1.5">
                                <FormLabel htmlFor="playerTwoId">Opponent</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select an Opponent" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {users?.map((user) => {
                                            if (user.id === currentUser.id) return null;
                                            return (
                                                <SelectItem key={user.id} value={user.id}>
                                                    <div className="flex flex-row items-center justify-center gap-1">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={user.profileImageUrl}
                                                                alt={user.firstName ?? ""}
                                                            />
                                                        </Avatar>
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ranked"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Ranked</FormLabel>
                                    <FormDescription>Count match towards match rating.</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </section>
    );
};

export default AddMatch;