import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: ["src/**/*.{ts,tsx}", "src/styles/**/*.css"],
    darkMode: ["class"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--surface1))",
                input: "hsl(var(--surface1))",
                ring: "hsl(var(--overlay2))",
                background: "hsl(var(--base))",
                foreground: "hsl(var(--maintext))",
                primary: {
                    DEFAULT: "hsl(var(--maintext))",
                    foreground: "hsl(var(--surface2))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--crust))",
                    foreground: "hsl(var(--overlay2))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--red))",
                    foreground: "hsl(var(--rosewater))",
                },
                muted: {
                    DEFAULT: "hsl(var(--overlay1))",
                    foreground: "hsl(var(--subtext0)",
                },
                accent: {
                    DEFAULT: "hsl(var(--surface1))",
                    foreground: "hsl(var(--pink))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--mantle))",
                    foreground: "hsl(var(--maintext))",
                },

                base: "hsl(var(--base))",
                crust: "hsl(var(--crust))",
                mantle: "hsl(var(--mantle))",

                surface0: "hsl(var(--surface0))",
                surface1: "hsl(var(--surface1))",
                surface2: "hsl(var(--surface2))",

                overlay0: "hsl(var(--overlay0))",
                overlay1: "hsl(var(--overlay1))",
                overlay2: "hsl(var(--overlay2))",

                maintext: "hsl(var(--maintext))",
                subtext0: "hsl(var(--subtext0))",
                subtext1: "hsl(var(--subtext1))",

                ctp: {
                    rosewater: "hsl(var(--rosewater))",
                    flamingo: "hsl(var(--flamingo))",
                    pink: "hsl(var(--pink))",
                    mauve: "hsl(var(--mauve))",
                    red: "hsl(var(--red))",
                    maroon: "hsl(var(--maroon))",
                    peach: "hsl(var(--peach))",
                    yellow: "hsl(var(--yellow))",
                    green: "hsl(var(--green))",
                    teal: "hsl(var(--teal))",
                    sky: "hsl(var(--sky))",
                    sapphire: "hsl(var(--sapphire))",
                    blue: "hsl(var(--blue))",
                    lavender: "hsl(var(--lavender))",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            // fontFamily: {
            //     sans: ["var(--font-sans)", ...fontFamily.sans],
            // },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
