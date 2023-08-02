/**
 * 对两份编译后的css文件进行排序
 */
const fs = require('fs');
const fileName = `./index`;
const fileNameChanged = `${fileName}-changed`;

const fileNames = [fileName, fileNameChanged];
fileNames.forEach((f, index) => {
	fs.readFile(`${f}.css`, (err, data) => {
    if (err) {
      return
    }
		let formatStr = data.toString();
    // 特殊处理这种格式场景
		formatStr = formatStr.replace(/\@media\(/g, '@media (');
		// formatStr = formatStr.replace(/\[data-v-.*?\]/g, '[***]')
		formatStr = formatStr
			.match(/[^\{\}]*(\{[^\{\}]*\})/g)
			.sort()
			.join('');
		fs.writeFile(`${f}-fotmat.css`, formatStr, () => {});
	});
});


/**
 * 利用webpack打包成一个css文件
 * 		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					styles: {
						name: 'styles',
						test: m => m.constructor.name === 'CssModule',
						chunks: 'all',
						minChunks: 1,
						enforce: true
					}
				}
			}
		}
 */