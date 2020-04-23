var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',  
    entry: path.resolve(__dirname, './src/index.jsx'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader:'babel-loader',
                    options: {
                        presets: ['react', 'es2015', 'stage-3']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' }, // creates style nodes from JS strings
                    { loader: 'css-loader' }, // translates CSS into CommonJS
                    { loader: 'sass-loader' } // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            { template: './src/index.html', filename: 'index.html', inject: 'body' }
        ),
        new CopyWebpackPlugin([
            { from: './src/_assets', to: './src/_assets'}
        ])
    ],
    devServer: {
        historyApiFallback: true
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: process.env.NODE_ENV === 'dev' ? 'http://localhost:5000' : 'https://pdb-server.herokuapp.com',
            version: require('./package.json').version
        })
    },
    //workaround can't resolve 'fs' in glob
    node: {
        fs: 'empty'
    }
}