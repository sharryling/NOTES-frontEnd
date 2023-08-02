/**
 * 对scss文件进行prettier格式化
 */

const sh = require('shelljs');

function pexec(cmd) {
	return new Promise((resolve, reject) => {
		const result = sh.exec(cmd);
		const { stdout, stderr, code } = result;
		if (code === 0 || !stderr) {
			resolve(stdout);
		} else {
			console.log('stderr', cmd, '->', stderr, result);
			reject(stderr);
		}
	});
}
function prettierFiles(param) {
	const matches = param.match(/(.*?).styl$/);
	const fileName = matches ? matches[1] + '.scss' : param;

	return new Promise(async (resolve) => {
		if (fileName.match(/.scss$/)) {
		  // 直接prettier
		  console.log('-->> jjj ')
		  await pexec(`prettier --write ${fileName}`);
		  resolve()
		}
	});
}
async function main() {
	const { needToConvertFiles, recentChangedDocuments } = require('./convertStyleToScss-temp');
	startToConvert(needToConvertFiles, recentChangedDocuments);
}

async function startToConvert(needToConvertFiles, recentChangedDocuments) {
	for (let i = 0; i < needToConvertFiles.length; i++) {
		const item = needToConvertFiles[i];
		const target = recentChangedDocuments.find((i) => i.fileName.includes(item.split('./')[1]));
		if (target) {
			console.log('有开发者正在开发该文件，跳过', target.branch, item);
			continue;
		}
		await prettierFiles(item);
	}
}
main()
	.then(() => {
		console.log('==================');
		console.log('done!');
		console.log('==================');
	})
	.catch((error) => {
		console.error('build with error:', error);
	});
