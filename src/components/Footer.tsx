import Link from "next/link";

export default function Navbar() {
    return (
        <footer className="m-5 flex flex-col items-center justify-center">
            <h2>Aaron Freemantle &middot; Developer</h2>
            <ul>
                <li>
                    <Link href="/privacy">Privacy Policy</Link>
                </li>
            </ul>
            <p>
                <small>&copy; 2023 Aaron Freemantle. All rights reserved.</small>
            </p>
        </footer>
    );
}
