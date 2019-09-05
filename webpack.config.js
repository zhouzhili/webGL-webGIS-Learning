const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // eslint-disable-line
const fs = require('fs')

const entry = {}
const entryDir = fs.readdirSync('./webglCodes')
entryDir.forEach(dir => {
  entry[dir] = `./webglCodes/${dir}/app`
})

module.exports = function(env = {}) {
  const outputPath = path.resolve(__dirname, env.outputPath || 'dist')

  const output = {
    path: outputPath,
    filename: '[name]/app.js',
    publicPath: './'
  }

  const plugins = []

  let optimization = {}

  if (!env.production) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  // const buildFolder = env.folder

  if (env.production) {
    Object.keys(entry).forEach(key => {
      let template = './src/assets/webgl.html'
      let chunks = ['glHelper']
      if (key.startsWith('webgl-')) {
        template = './src/assets/template.html'
      } else {
        chunks.push('vendor')
      }
      chunks.push(key)
      plugins.push(
        new HtmlWebpackPlugin({
          template,
          title: key,
          chunks,
          filename: `${key}.html`
        })
      )
    })

    optimization = {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'glHelper',
            chunks: 'initial',
            minSize: 0,
            minChunks: 2
          },
          vendor: {
            priority: 1, //添加权重
            test: /node_modules/, //把这个目录下符合下面几个条件的库抽离出来
            name: 'vendor',
            chunks: 'initial', //刚开始就要抽离
            minSize: 0, //大小大于0字节的时候需要抽离出来
            minChunks: 2 //重复2次使用的时候需要抽离出来
          }
        }
      }
    }
  }

  return {
    mode: env.production ? 'production' : 'none',
    devtool: env.production ? '' : 'cheap-module-eval-source-map',
    entry,
    output,
    resolve: {
      alias: {
        GLHelper: path.resolve(__dirname, 'src/GLHelper'),
        '@': path.resolve(__dirname, 'src')
      }
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/.*/,
          use: {
            loader: 'babel-loader',
            options: { babelrc: true }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(frag|vert|glsl)$/,
          use: {
            loader: 'glsl-shader-loader',
            options: {}
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: outputPath + '/' + 'img/[name].[hash:7].[ext]'
          }
        }
      ]

      /* Advanced module configuration (click to show) */
    },
    // Don't follow/bundle these modules, but request them at runtime from the environment

    stats: 'errors-only',
    // lets you precisely control what bundle information gets displayed

    devServer: {
      contentBase: path.join(__dirname, env.server || '.'),
      compress: true,
      port: 3000,
      hot: true,
      open: true
      // ...
    },

    plugins,
    optimization
    // list of additional plugins

    /* Advanced configuration (click to show) */
  }
}
