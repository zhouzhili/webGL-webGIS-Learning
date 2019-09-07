const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // eslint-disable-line
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')

const entry = {}
const entryDir = fs.readdirSync('./webglCodes')
entryDir.forEach(dir => {
  entry[dir] = `./webglCodes/${dir}/app`
})

const copyFileToDist = dirName => {
  const dir = `./webglCodes/${dirName}`
  var pa = fs.readdirSync(dir)
  const needCopyList = []
  pa.forEach(ele => {
    if (!['app.js', 'index.html', 'readme.md'].includes(ele)) {
      needCopyList.push({
        from: `${dir}/${ele}`,
        to: `${dirName}/${ele}`
      })
    }
  })
  return new CopyWebpackPlugin(needCopyList)
}

module.exports = function(env = {}) {
  const outputPath = path.resolve(__dirname, 'dist')
  const publicPath = env.production ? './' : '/'
  const output = {
    path: outputPath,
    filename: '[name]/app.js',
    publicPath: publicPath
  }

  const plugins = []

  let optimization = {}

  if (!env.production) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (env.production) {
    Object.keys(entry).forEach(key => {
      let template = './src/assets/webgl.html'
      let chunks = []
      if (key.startsWith('webgl-')) {
        chunks.push('glHelper')
        template = './src/assets/template.html'
      } else {
        chunks.push('three', 'glHelper')
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
      // 复制材质模型等文件
      plugins.push(copyFileToDist(key))
    })

    optimization = {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'glHelper',
            filename: '[name].utils.js',
            chunks: 'initial',
            minSize: 0,
            minChunks: 2
          },
          vendor: {
            priority: 1, //添加权重
            test: /node_modules/, //把这个目录下符合下面几个条件的库抽离出来
            name: 'three',
            filename: '[name].vendor.js',
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
