import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "~/components/Layout";
import { ThemeProvider } from "next-themes";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
            <Analytics />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
