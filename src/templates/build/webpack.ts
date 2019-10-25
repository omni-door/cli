export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `const path = require('path')

module.exports = {
  entry: path.join(__dirname, '../src/index.${ts ? 'ts' : 'js'}'),
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, '../lib')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "..", "src/components/"),
        exclude: /node_modules/,
        use: [
          {loader: 'babel-loader'}
        ]
      },
      ${ts ? `{
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, "..", "src/"),
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },` : ''}
      {
        test: /\.css$/,
        use:  ['style-loader', 'css-loader'],
        exclude: /node_modules(?!\/@storybook\/addon-info)/
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: path.resolve(__dirname, "..", "src/components/"),
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, "..", "src/components/"),
      }
    ],
  },
  plugins: [
    // your custom plugins
  ],
  mode: 'production',
  resolve: {
    extensions: [${ts ? '".ts", ".tsx", ' : ''}".js", ".jsx", ".scss", ".less", ".css"]
  }
};
`;
}