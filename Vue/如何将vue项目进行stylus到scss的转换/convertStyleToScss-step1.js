/**
 * 更新分支: 删除当前的temp-fa；
 * 拉取远程的fa-分支，并创建新的temp-fa分支，
 * merge develop
 */

const sh = require('shelljs');
const exclude_branch = ['fa-convert-stylus-to-scss', 'fa-wealth-ui', 'fa-micro-frontend/microApp', 'fa-convert-stylus-to-scss-1', 'fa-micro-frontend/qiankun', 'fa-vite-support-work', 'fa-vite-support-work_merge'];
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

// 更新分支: 删除当前的temp-fa；拉去远程的fa-分支，并创建新的temp-fa分支，merge develop
async function updateBranchTemp() {
	return new Promise(async (resolve) => {
		const stdout = await pexec('git branch | grep temp-fa');
		console.log('Step 0 ', stdout);
		if (stdout) {
			const promises1 = stdout.split('\n').map(async (str) => {
				return new Promise(async (resolve) => {
					const branch = str.trim();
					branch && (await pexec(`git branch -D ${branch}`));
					resolve();
				});
			});
			console.log('Step 1 ');
			await Promise.all(promises1);
		}

		const stdout1 = await pexec('git branch -a | grep remotes/origin/fa-');
		console.log('Step 2 ', stdout1);
    const outs = stdout1.split('\n')
    for (let i = 0; i <= outs.length - 1; i++) {
        let str = outs[i]
				const originBranch = str.trim();
				const branch = originBranch.split('remotes/origin/')[1];
				if (!branch) {
					continue;
				}

				if (exclude_branch.some((item) => branch === item)) {
					continue;
				}
				console.log('-> branch 1', branch);
				await pexec(`git checkout ${originBranch} && git checkout -b temp-${branch}`);
        await pexec(`git merge develop`)
        await pexec(`git add .`)
        console.log('-> branch 2', branch);
				await pexec(`git commit -m 'temp: merge deveop' --no-verify`);
    }
			await pexec(`git checkout fa-convert-stylus-to-scss`);
	});
}

async function main() {
	// Step 0
	await updateBranchTemp();
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
