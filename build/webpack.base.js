const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const autoprefixer = require('autoprefixer');

const setMPA = ()=>{
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname,'../src/pages/*/*.js'))
    entryFiles.map((item)=>{
        const match = item.match(/src\/pages\/(.*)\/(.*).js$/);
        const pageName = match && match[1];
        entry[pageName] = item;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template : path.join(__dirname,`../src/pages/${ pageName }/${ pageName }.html`),
                filename : `${pageName}.html`,
                chunks : [pageName],
                inject : true,
                minify : {
                    html5 : true,
                    collapseWhitespace:true,
                    preserveLineBreaks : false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments:false
                }
            })
        )
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry,htmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    output : {
        path:path.join(__dirname,'../dist'),
        filename: './source/pages/[name]/[name].js',
    },
    module : {
        rules : [
            {
                test : /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /(node_modules|plugs)/,
                options: {
                    fix:true,
                    emitWarning:true,
                }
            },
            {
                test : /\.vue$/,
                use : 'vue-loader'
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
					{
						loader:'postcss-loader',
						options: { 
                            plugins: () => [ 
                                autoprefixer
                            ]
                        }
					},
					'less-loader',
                ]
            },
            {
                test : /\.(png|svg|jpg|gif)$/,
                use : [
                    {
                        loader:'url-loader',
                        options: {
                            limit:10240
                        }
                    }
                ]
            },
        ] 
    },
    plugins: [
        ...htmlWebpackPlugins,
        new MiniCssExtractPlugin({
            filename:'./source/pages/[name]/[name].css',
        }),
        new copyWebpackPlugin([
            {
                from:path.resolve(__dirname, '../src/static'),
                to:'./source/static' 
            }
        ]),
        new VueLoaderPlugin(),
    ],
    optimization:{
        splitChunks:{
            chunks:'all',
            minSize:30000,
            cacheGroups:{
                plugs: {
                    name:'../plugs/plugs',
                    test: /(node_modules|plugs)/,
                    chunks:'all',
                    minChunks: 2,
                    priority: 10
                },
                common: {
                    name:'../plugs/common',
                    test: /common/,
                    chunks:'all',
                    minChunks: 2,
                    priority: 0
                }
            }
        }
    }
}