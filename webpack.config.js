const path = require('path')

module.exports = {
  // ...其他配置保持不变
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: [
              '@emotion/babel-plugin',
              // 其他插件...
            ],
          },
        },
      },
      // 添加对CSS的支持
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/fetch': path.resolve(__dirname, 'src/fetch'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // ...其他配置
}
