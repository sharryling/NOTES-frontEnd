/**
 * 对比temp-分支和develop分支的差别，记录.vue和.stylus改动的文件名，即为其他开发正在修改的文件，
 * 存储到recentChangedDocuments，为防止合并冲突后续将跳过这些文件的转换；
 * 记录xweb/src中的styl,vue，即为需要进行转换的文件，存储到needToConvertFiles
 */

const sh = require('shelljs');
const fs = require('fs');
const glob = require('glob');

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
const commonPath = './xweb/src';
async function markDevelopingDocument() {
	const recentChangedDocuments = [];
	return new Promise(async (resolve) => {
		const stdout = await pexec('git branch');
		const strs = stdout.split('\n');
		for (let i = 0; i < strs.length - 1; i++) {
			let branch = strs[i].trim();
			console.log('===>>>> branch', branch);
			if (!branch.includes('temp-fa')) {
				continue;
			}
			const stdout2 = await pexec(`git checkout ${branch} & git diff develop --name-status xweb/src/`);
			stdout2.split('\n').forEach((item) => {
				const s = item.split('\t');
				if (s.length > 1 && (s[1].match(/(.*)(.vue)$/) || s[1].match(/(.*)(.styl)$/)) && !recentChangedDocuments.some((i) => i.fileName === s[1])) {
					recentChangedDocuments.push({
						fileName: s[1],
						branch
					});
				}
			});
		}
		await pexec(`git checkout fa-convert-stylus-to-scss-1`);
		resolve(recentChangedDocuments);
	});
}
function deepConvert() {
	return new Promise((resolve) => {
		glob(`${commonPath}/**/*.{styl,vue}`, (_, files) => {
			resolve(files);
		});
	});
}
async function main() {
	await start();
}
async function start() {
	const recentChangedDocuments = await markDevelopingDocument();
	const needToConvertFiles = await deepConvert('');
	console.log('==================> developingOnes', recentChangedDocuments);
	console.log('==================> needToConvertFiles', needToConvertFiles);
	return new Promise((resolve, reject) => {
		fs.writeFile(
			'./scripts/convertStyleToScss-temp.js',
			`const needToConvertFiles = ${JSON.stringify(needToConvertFiles)}; 
      \n 
      const recentChangedDocuments = ${JSON.stringify(recentChangedDocuments)};
      \n 
      module.exports = {
        needToConvertFiles,
        recentChangedDocuments
      }
      `,
			(err) => {
				if (!err) {
					console.log('success~');
					resolve({
						needToConvertFiles,
						recentChangedDocuments
					});
				}
			}
		);
	});
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
