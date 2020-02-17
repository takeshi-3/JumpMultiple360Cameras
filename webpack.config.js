const path = require('path');

const MODE = "development";
const enabledSourceMap = MODE === "development";

module.exports = {
    mode: 'development',    // ['development': create source map, 'production': compress source file]
    // watch: true,         // detect changes  *[unsoleved]これ使うとbuildが終わらなくなる
    entry: './src/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public/js')
    },
    module: {
        rules: [
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
            }
        ]
    }
}