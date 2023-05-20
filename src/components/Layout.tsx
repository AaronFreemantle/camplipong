import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="m-auto max-w-screen-xl">{children}</main>
            <Footer />
        </>
    );
}
