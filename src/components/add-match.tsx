import { useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/form";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { useState } from "react";

const formSchema = z
    .object({
        playerOneScore: z.coerce.number({ invalid_type_error: "Expected number" }).min(0),
        playerTwoScore: z.coerce.number({ invalid_type_error: "Expected number" }).min(0),
        playerTwoId: z.string(),
    })
    .refine(
        ({ playerOneScore, playerTwoScore }) => {
            return playerOneScore > playerTwoScore || playerOneScore < playerTwoScore;
        },
        { message: "Scores must be different", path: ["playerOneScore"] }
    )
    .refine(
        ({ playerOneScore, playerTwoScore }) => {
            return playerOneScore > playerTwoScore || playerOneScore < playerTwoScore;
        },
        { message: "Scores must be different", path: ["playerTwoScore"] }
    );

const AddMatch = () => {
    const { user: currentUser, isSignedIn } = useUser();
    const { data: users } = api.user.getAll.useQuery();
    const ctx = api.useContext();

    const { mutate: createMatch, isLoading } = api.match.create.useMutation({
        onSuccess: () => {
            void ctx.match.getAll.invalidate();
            void ctx.user.getAllWithMatches.invalidate();
        },
    });

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    if (!isSignedIn) return null;

    function onSubmit(values: z.infer<typeof formSchema>) {
        createMatch({
            ...values,
        });
    }

    return (
        <section className="m-2">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-center">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full">
                            <h2 className="text-center text-2xl">Add Match</h2>
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
                            <FormField
                                control={form.control}
                                name="playerOneScore"
                                render={({ field }) => (
                                    <FormItem className="w-full items-center gap-1.5">
                                        <FormLabel htmlFor="playerOneScore">Your Score</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} {...field} />
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
                                            <Input disabled={isLoading} {...field} />
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
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
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
                            <Button disabled={isLoading} type="submit" variant="outline">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CollapsibleContent>
            </Collapsible>
        </section>
    );
};

export default AddMatch;
