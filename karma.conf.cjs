module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: ["spec/**/*.spec.js", "spec/**/*.spec.jsx"],
    preprocessors: {
      "spec/**/*.spec.js": ["webpack"],
      "spec/**/*.spec.jsx": ["webpack"],
    },
    webpack: {
      mode: "development",
      devtool: false,
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                plugins: [["istanbul", { exclude: ["spec/**", "**/*.spec.*"] }]],
              },
            },
          },
        ],
      },
    },
    reporters: ["progress", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "html" }, { type: "text-summary" }, { type: "lcovonly" }],
    },
    browsers: ["ChromeHeadless"],
    singleRun: true,
    restartOnFileChange: false,
  });
};