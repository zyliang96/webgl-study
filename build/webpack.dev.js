const webpack = require("webpack");
const path = require("path");
const URL = require("url");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const mockup = require("../mockup");
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
                    test: /\.(jpe?g|png|gif|mp3)(\?.+)?$/,
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
            stats: {colors: true},
            disableHostCheck: true,
            host: "127.0.0.1",
            open: true,
            inline: true,
            proxy: {
                "/warehouseManage": {
                    target: options.mock
                        ? ""
                        : "http://kfpt3server.marketing-test.sit.91lyd.com/",
                    changeOrigin: true,
                    pathRewrite: {},

                },
            },
        },
    };

    return config;
};
