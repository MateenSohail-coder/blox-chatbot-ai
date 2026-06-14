const config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },

            colors: {
                // Pure-black surface aliases used throughout the design
                pitch: {
                    DEFAULT: "#000000",
                    950: "#09090b",
                },
            },

            boxShadow: {
                "neon-indigo": "0 0 20px rgba(99,102,241,0.35), 0 0 40px rgba(99,102,241,0.1)",
                "neon-violet": "0 0 20px rgba(139,92,246,0.35), 0 0 40px rgba(139,92,246,0.1)",
                "neon-emerald": "0 0 20px rgba(52,211,153,0.35), 0 0 40px rgba(52,211,153,0.1)",
                "card-dark": "0 0 40px rgba(0,0,0,0.6)",
                "card-dark-lg": "0 24px 80px rgba(0,0,0,0.9)",
            },

            animation: {
                "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
                float: "float 3.5s ease-in-out infinite",
                blink: "blink-cursor 1s step-end infinite",
                marquee: "marquee 30s linear infinite",
            },

            keyframes: {
                "pulse-glow": {
                    "0%, 100%": {
                        boxShadow: "0 0 20px rgba(129,140,248,0.35), 0 0 40px rgba(129,140,248,0.1)",
                    },
                    "50%": {
                        boxShadow: "0 0 30px rgba(129,140,248,0.55), 0 0 60px rgba(129,140,248,0.2)",
                    },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                "blink-cursor": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
        },
    },

    plugins: {
        "@tailwindcss/postcss": {},
    },
};

export default config;