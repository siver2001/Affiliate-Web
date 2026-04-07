export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                canvas: "#f6f1e8",
                ink: "#1d2b2a",
                coral: "#f06a4e",
                pine: "#1f4d46",
                mist: "#dbe4df",
                sand: "#f0e2c8"
            },
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
                serif: ["Roboto", "sans-serif"]
            },
            borderRadius: {
                xl: "1.25rem",
                "2xl": "1.75rem"
            },
            boxShadow: {
                soft: "0 20px 60px rgba(29, 43, 42, 0.08)"
            }
        }
    },
    plugins: []
};
