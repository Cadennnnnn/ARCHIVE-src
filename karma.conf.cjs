// Archivo: karma.conf.cjs
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      'spec/**/*.spec.ts',
      'spec/**/*.spec.tsx',
    ],

    preprocessors: {
      'spec/**/*.spec.ts': ['webpack'],
      'spec/**/*.spec.tsx': ['webpack'],
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',

      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },

      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        chrome: '100',
                      },
                    },
                  ],
                  [
                    '@babel/preset-react',
                    {
                      runtime: 'automatic',
                    },
                  ],
                  '@babel/preset-typescript',
                ],
                plugins: [
                  [
                    'istanbul',
                    {
                      exclude: ['spec/**', '**/*.spec.*'],
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html' },
        { type: 'lcovonly' },
        { type: 'text-summary' },
      ],
    },

    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: false,
    colors: true,
    logLevel: config.LOG_INFO,
  });
};