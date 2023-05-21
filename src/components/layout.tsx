import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="m-auto max-w-screen-xl">{children}</main>
            <Footer />
        </>
    );
}
