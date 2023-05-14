import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const user = useUser();

    return (
        <nav className="md:mx-auto md:my-0 md:max-w-screen-xl">
            <ul className="flex flex-row flex-wrap items-center justify-center gap-2 p-2 text-xl font-medium">
                <li className="flex basis-full items-center justify-center gap-2 md:mr-auto md:basis-auto md:text-left">
                    <Image src="/favicon.ico" alt="Camplipong" width="40" height="40" />
                    <Link href="/">
                        <h1 className="text-2xl font-bold">Camplipong</h1>
                    </Link>
                </li>
                <li>
                    <Link href="/faq">FAQ</Link>
                </li>
                <li>{!user.isSignedIn ? <SignInButton /> : <SignOutButton />}</li>
            </ul>
        </nav>
    );
}
