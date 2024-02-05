const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
	entry: {
		main: './src/index.tsx',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.scss'],
		alias: {
			'@components': path.resolve(__dirname, 'src/components'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@models': path.resolve(__dirname, 'src/models'),
			'@hooks': path.resolve(__dirname, 'src/hooks'),
		},
	},
	output: {
		path: path.join(__dirname, './dist'),
		filename: 'app.min.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.s(a|c)ss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]',
							},
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(ttf|woff|woff2)$/,
				exclude: /node_modules/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.(jpg|png|svg|gif)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name][ext]',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			favicon: './src/assets/logo.svg',
		}),
	],
};

module.exports = commonConfig;
