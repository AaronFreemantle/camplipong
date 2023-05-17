import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const { user, isSignedIn } = useUser();

    return (
        <nav className="md:mx-auto md:my-0 md:max-w-screen-xl">
            <ul className="flex flex-row flex-wrap items-center justify-center gap-2 p-2 text-xl font-medium">
                <li className="flex basis-full items-center justify-center gap-2 md:mr-auto md:basis-auto md:text-left">
                    <Image src="/favicon.ico" alt="Camplipong" width="40" height="40" />
                    <Link href="/">
                        <h1 className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
                            Camplipong<sup className="text-gray-700">beta</sup>
                        </h1>
                    </Link>
                </li>
                <li className="px-10">
                    <Link href="/faq">FAQ</Link>
                </li>
                <li>{!isSignedIn ? <SignInButton /> : <p>{user.fullName}</p>}</li>
                <UserButton />
            </ul>
        </nav>
    );
}
