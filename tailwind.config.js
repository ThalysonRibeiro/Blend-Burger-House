/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./**/*.{html,js}", // Inclui todos os arquivos HTML e JS no projeto
		"!./node_modules/**", // Exclui explicitamente a pasta node_modules
	],
	theme: {
		fontFamily: {
			"sans": ['Roboto', "sans-serif"]
		},
		extend: {
			backgroundImage: {
				home: "url('/assets/img/bg2.png')",
			},
		},
	},
	plugins: [],
};
