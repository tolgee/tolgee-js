const path = require('path');

const targets = ["umd", "window", "commonjs"];


module.exports = env => {
    const isDevelopment = env.mode === "development";

    const makeTarget = (target) => {
        return {
            entry: path.join(__dirname, "src", "index.ts"),
            devtool: 'source-map',
            output: {
                filename: "polygloat." + target + ".js",
                path: path.resolve(__dirname, 'dist'),
                library: '@polygloat/core',
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
                        exclude: [/node_modules/, /lib/, /\.spec\.ts/, /\.test\.ts/, /__mocks__/,/__testFixtures/],
                    },
                ]
            },
            mode: env.mode,
        }
    };

    return targets.map(t => makeTarget(t));
};
