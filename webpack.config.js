const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MinifyPlugin = require("babel-minify-webpack-plugin"),
      CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	entry: {
		app: path.join(__dirname, 'src/js/index.js')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: "[name].bundle.js"
	},
	module: {
    rules: [
			{
	      test: /\.js$/,
	      exclude: /node_modules/,
	      use: {
            loader: 'babel-loader',
  	        options: {
  	          presets: [
  	            ['env', {
  	            	modules: false
  	            }]
  	          ]
  	        }
        }
	    },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: path.join(__dirname + 'dist')
            }
          },
          'extract-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            // publicPath: 'https://s3.us-east-2.amazonaws.com/kals-pomodoro-clock/'
          }
        }
      }
    ]
	},
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false
    }),
    new MinifyPlugin({}, {
      exclude: /node_modules/
    })
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.ttf$/,
    //   threshold: 10240,
    //   minRatio: 0.8,
    //   deleteOriginalAssets: true
    // })
  ]
}
