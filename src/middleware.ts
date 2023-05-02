import { withClerkMiddleware } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export default withClerkMiddleware((req: NextRequest) => {
    return NextResponse.next();
});

export const config = {
    matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
