const path = require('path');
const webpack = require('webpack')
const WebpackBar = require('webpackbar');
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackDevServer = require('webpack-dev-server');
const isDev = process.env.NODE_ENV === 'development'
const config = {
    mode:'development',
    target:'web',
    devtool:'source-map',
    entry: {
        app: './src'
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            // {
            //     test: /\.svg$/,
            //     loader: 'svg-sprite-loader',
            //     include: path.resolve(__dirname, './src/assets/svg')
            // },
            {
                test: /\.(png|svg|woff|woff2|eot|ttf|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        outputPath: 'images/',
                        esModule: false
                    }
                }],
                exclude: [path.resolve(__dirname, './src/assets/svg')]
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            template: path.resolve(__dirname, './src/index.html')
        }),
    ],
}


const devServer = new WebpackDevServer(webpack(config), {
    publicPath: '/',
    hot: true,
    contentBase:path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    stats: {colors: true},
    disableHostCheck: true,
    host: '0.0.0.0',
})
devServer.listen(5414, '0.0.0.0', error => {
    if (error) {
        throw error;
    }
});
