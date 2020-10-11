const path = require('path');

const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = env => {
    const isDevelopment = env.mode === "development";

    const makeTarget = (target) => ({
        entry: "./src/index.ts",
        devtool: 'source-map',
        output: {
            filename: "polygloat." + target + ".js",
            path: path.resolve(__dirname, 'dist'),
            library: 'polygloat',
            libraryTarget: target
        },
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [isDevelopment && "ts-loader" || "babel-loader"],
                    exclude: [/node_modules/, /lib/],
                },
            ]
        },
        mode: env.mode,
        plugins: [
            //new WebpackBundleAnalyzer()
        ]
    });

    return [makeTarget("umd"), makeTarget("window")];
};
