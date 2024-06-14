import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "frontpage-banner": "url('/assets/images/banner-background.png')",
      },
      screens: {
        "xs": "475px", // assuming you want to add an extra small breakpoint
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
        "3xl": "1750px", // the new 3xl breakpoint
        "4xl": "1920px",
      },
    },
  },
  plugins: [],
};
export default config;
