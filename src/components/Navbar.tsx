import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
    const user = useUser();

    return (
        <nav>
            <ul className="flex gap-2">
                <li>
                    <h1>Navbar</h1>
                </li>
                <li>{!user.isSignedIn ? <SignInButton /> : <SignOutButton />}</li>
            </ul>
        </nav>
    );
}
