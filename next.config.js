module.exports = {
	webpack(config){
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		})

		return config;
	},
	images: {
		domains: [
			"static-cdn.jtvnw.net",
			"i.ytimg.com",
			"yt3.ggpht.com"
		]
	}
}