import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-tr from-crust to-surface0">
            <Navbar />
            <main className="m-auto max-w-screen-xl">{children}</main>
            <Footer />
        </div>
    );
}
