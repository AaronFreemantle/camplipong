import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [
        require("@catppuccin/tailwindcss")({
            defaultFlavour: "frappe",
        }),
    ],
} satisfies Config;
