import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        },
        "info-1": "var(--info-1)",
        "info-2": "var(--info-2)",
        "info-3": "var(--info-3)",
        "info-4": "var(--info-4)",
        "info-5": "var(--info-5)",
        "info-6": "var(--info-6)",
        "info-7": "var(--info-7)",
        "info-8": "var(--info-8)",
        "info-9": "var(--info-9)",
        "info-10": "var(--info-10)",

        "primary-1": "var(--primary-1)",
        "primary-2": "var(--primary-2)",
        "primary-3": "var(--primary-3)",
        "primary-4": "var(--primary-4)",
        "primary-5": "var(--primary-5)",
        "primary-6": "var(--primary-6)",
        "primary-7": "var(--primary-7)",
        "primary-8": "var(--primary-8)",
        "primary-9": "var(--primary-9)",
        "primary-10": "var(--primary-10)",
        "primary-11": "var(--primary-11)",

        "success-1": "var(--success-1)",
        "success-2": "var(--success-2)",
        "success-3": "var(--success-3)",
        "success-4": "var(--success-4)",
        "success-5": "var(--success-5)",
        "success-6": "var(--success-6)",
        "success-7": "var(--success-7)",
        "success-8": "var(--success-8)",
        "success-9": "var(--success-9)",
        "success-10": "var(--success-10)",
        "success-11": "var(--success-11)",

        "warning-1": "var(--warning-1)",
        "warning-2": "var(--warning-2)",
        "warning-3": "var(--warning-3)",
        "warning-4": "var(--warning-4)",
        "warning-5": "var(--warning-5)",
        "warning-6": "var(--warning-6)",
        "warning-7": "var(--warning-7)",
        "warning-8": "var(--warning-8)",
        "warning-9": "var(--warning-9)",
        "warning-10": "var(--warning-10)",
        "warning-11": "var(--warning-11)",

        "danger-1": "var(--danger-1)",
        "danger-2": "var(--danger-2)",
        "danger-3": "var(--danger-3)",
        "danger-4": "var(--danger-4)",
        "danger-5": "var(--danger-5)",
        "danger-6": "var(--danger-6)",
        "danger-7": "var(--danger-7)",
        "danger-8": "var(--danger-8)",
        "danger-9": "var(--danger-9)",
        "danger-10": "var(--danger-10)",
        "danger-11": "var(--danger-11)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: [...fontFamily.sans]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--bits-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--bits-accordion-content-height)" },
          to: { height: "0" }
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite"
      }
    },
    screens: {
      xs: "501px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
