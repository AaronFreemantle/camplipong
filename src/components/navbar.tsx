import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
    const { user, isSignedIn, isLoaded } = useUser();

    return (
        <nav className="md:mx-auto md:my-0 md:max-w-screen-xl">
            <ul className="flex flex-row flex-wrap items-center justify-center gap-2 p-2 text-xl font-medium">
                <li className="flex basis-full items-center justify-center gap-2 md:mr-auto md:basis-auto md:text-left">
                    <Image src="/favicon.ico" alt="Camplipong" width="40" height="40" />
                    <Link href="/">
                        <h1 className="bg-gradient-to-r from-ctp-sapphire to-ctp-pink bg-clip-text text-2xl font-bold text-transparent">
                            Camplipong<sup className="text-foreground">beta</sup>
                        </h1>
                    </Link>
                </li>
                <li>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => (window.location.href = "https://github.com/AaronFreemantle/camplipong")}
                    >
                        <Icons.gitHub className="h-5 w-5" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </li>
                <li>
                    <ThemeToggle />
                </li>
                {isLoaded ? (
                    <>
                        <li>{!isSignedIn ? <SignInButton /> : <p>{user.fullName}</p>}</li>
                        <UserButton />
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                )}
            </ul>
        </nav>
    );
}
