"use strict";

const TerserJSPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = (env) => {
    const DEBUG = env.debug === "true";
    return {
        mode: (DEBUG) ? "development" : "production",
        entry: {"app": "./src/ts/index.ts"},
        output: {path: path.join(__dirname, "./assets/"), filename: "[name].js", library: "App"},
        devtool: (DEBUG) ? "inline-cheap-source-map" : false,
        resolve: {
            extensions: [".ts", ".js"],
        },
        watch: DEBUG,
        watchOptions: {aggregateTimeout: 100},
        module: {
            rules: [
                {
                    test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/
                },
            ],
        },
        plugins: [],
        optimization: {
            minimize: !DEBUG,
            minimizer: [
                new TerserJSPlugin({
                    parallel: 4,
                    terserOptions: {
                        compress: {drop_console: !DEBUG},
                        output: {comments: DEBUG},
                    }
                })
            ]
        }
    }
};