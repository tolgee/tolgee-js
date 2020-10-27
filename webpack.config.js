const path = require('path');

const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const targets = [
    {
        submodule: "core",
        targets: ["umd", "window", "commonjs"],
        externals: {
            "polygloat/ui": "polygloat/ui"
        }
    }, {
        submodule: "ui",
        targets: ["umd", "window", "commonjs"],
        externals: {
            "polygloat/core": "polygloat/core"
        }
    }
]


module.exports = env => {
    const isDevelopment = env.mode === "development";

    const makeTarget = (submodule, target, externals) => {
        const subModuleBundleStr = (submodule !== "core" ? "." + submodule : "");
        const subModuleLibraryStr = (submodule !== "core" ? "/" + submodule : "");
        return {
            entry: path.join(__dirname, "src", submodule, "index.ts"),
            devtool: 'source-map',
            output: {
                filename: "polygloat." + target + subModuleBundleStr + ".js",
                path: path.resolve(__dirname, 'dist'),
                library: 'polygloat' + subModuleLibraryStr,
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
            ],
            externals
        }
    };

    return targets.reduce((acc, config) =>
        [...acc, ...config.targets.map(t => makeTarget(config.submodule, t, config.externals))], []);
};
