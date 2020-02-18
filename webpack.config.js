const path = require('path');

const MODE = "development";
const enabledSourceMap = MODE === "development";

module.exports = {
    mode: 'development',    // ['development': create source map, 'production': compress source file]
    watch: true,            // detect changes (for interactive development) 
    entry: './src/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public/js'),
        publicPath: "/js/"
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true
    },
    module: {
        rules: [
            // babel loader
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/react'
                            ]
                        }
                    }
                ]
            },
            // Sass loader
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: enabledSourceMap,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: enabledSourceMap
                        }
                    }
                ]
            },
            // to load & bundle image source from sass
            {
                test: /\.(gif|png|jpe?g|svg|ico)$/,
                loader: "url-loader"
            }
        ]
    }
}