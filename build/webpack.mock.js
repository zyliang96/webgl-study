const webpack = require("webpack");
const path = require("path");
const URL = require("url");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const mockup = require("../mockup");

function isPromise(obj) {
	return (
		!!obj &&
		(typeof obj === "object" || typeof obj === "function") &&
		typeof obj.then === "function"
	);
}

function writeResponse(res, data) {
	const content =
		typeof data === "object" && !(data instanceof Buffer)
			? JSON.stringify(data)
			: data;
	res.end(content);
}

/**
 * 返回404提示消息
 * @param res - http.ServerResponse
 * @param {string} path
 */
function response404(res, path) {
	res.statusCode = 404;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.end(`<p>${path} is not found</p>`);
}

module.exports = (options) => {
	let config = {
		// devtool: "eval",
		devtool: "inline-source-map",
		entry: [path.resolve(__dirname, "../src/index.js")],
		output: {
			publicPath: "/",
			path: path.resolve(__dirname, "../dist"),
			filename: "bundle.js",
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "../public/index.html"),
				filename: "index.html",
				compile: true,
				inject: true,
			}),
		],
		module: {
			rules: [
				{
					test: /\.ejs$/,
					loader: "ejs-loader",
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env", "@babel/preset-react"],
						},
					},
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader", "postcss-loader"],
				},
				{
					test: /\.less$/,
					use: ["style-loader", "css-loader", "less-loader", "postcss-loader"],
				},
				{
					test: /\.scss$/,
					use: ["style-loader", "css-loader", "sass-loader"],
				},
				{
					test: /\.(eot|svg|ttf|woff|woff2)(\?.+)?$/,
					loader: "file-loader",
				},
				{
					test: /favicon\.png$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]?[hash]",
							},
						},
					],
				},
				{
					test: /\.(jpe?g|png|gif)(\?.+)?$/,
					loader: "url-loader",
				},
				{
					test: /\.(png|jpg|jpeg|gif|svg|svgz)$/,
					include: [path.resolve(__dirname, "../src/pages/blog")],
					use: [
						{
							loader: "url-loader",
							options: {
								name: "images/[name].[ext]",
								publicPath: "/",
								limit: 4096,
							},
						},
					],
				},
			],
		},
		mode: "development",
		resolve: {
			alias: {
				"@": path.resolve("src"),
			},
		},
		devServer: {
			publicPath: "/",
			hot: true,
			historyApiFallback: true,
			stats: { colors: true },
			disableHostCheck: true,
			host: "127.0.0.1",
			open: true,
			inline: true,
			before: function (app) {
				const bodyParser = require("body-parser");
				app.use(bodyParser.json());
				Object.keys(mockup).forEach((item) => {
					app.use(item, (req, res, next) => {
						const func = require(mockup[item]);
						if (func) {
							const responseData = func(req.body || req.params);
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json; charset=utf-8");
							if (isPromise(responseData)) {
								json
									.then((data) => {
										writeResponse(res, data);
									})
									.catch((e) => {
										res.end(e);
									});
							} else {
								writeResponse(res, responseData);
							}
						} else {
							response404(res, item);
						}
					});
				});
			},
		},
	};

	return config;
};
