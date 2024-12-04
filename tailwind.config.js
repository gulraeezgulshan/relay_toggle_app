/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				kingfisher: {
					50: "#f5f2ff",
					100: "#ede7ff",
					200: "#ddd2ff",
					300: "#c4afff",
					400: "#a881ff",
					500: "#8f4fff",
					600: "#832afd",
					700: "#7519e8",
					800: "#6114c3",
					900: "#46108a",
					950: "#31096c",
				},
			},
		},
	},
	plugins: [],
};
