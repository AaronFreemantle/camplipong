import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "~/components/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Analytics />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
