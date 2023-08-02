/**
 * 改！！！4.2中，需要注意scoped的问题，不能全亮加scoped，后续需要修改
 * 读取needToConvertFiles, recentChangedDocuments，跳过recentChangedDocuments文件，开始转换：
 * 1. recentChangedDocuments文件中若存在调用了@import 某个.styl文件的情况，将单独改为引用scss；
 * 2. 除1外的文件，进行stylus-conver转换，并且删除旧的.styl文件；
 * 3. 对2进行单独的handleErrorConvert：
 *    3.1 存在/deep/，需要转换为::v-deep 
 *    【但是这里可以优化，面对/deep/.title /deep/span情况，应该要转换为::v-deep .title 和 ::v-deep span，加一个空格，目前手动处理了】
 * 4. 需要手动处理的部分：
 *    4.1 如代码问题，有些代码错误的，如>>>只在scoped才生效问题上，采取复原做法，已确保转换前后的一致；
 *    4.2 如部分被跳过的文件，但又引用了转换后的scss文件；
 *    4.3 如 margin: 15 + 2px的写法转换又问题
 */
 const sh = require('shelljs');
 const fs = require('fs');
 
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
 function handleErrorConvert(param) {
   const matches = param.match(/(.*?)(.styl|.stylus)$/)
   const fileName = matches ? matches[1] + '.scss' : param
   
   return new Promise((resolve) => {
     fs.readFile(fileName, (err, data) => {
       if (!data) {
         resolve()
         return
       }
       let str = data.toString();
       if (err) {
         return console.error('error: ', err);
       }
       const regIncludeDeep = fileName.match(/.vue$/) ? /<style.*?>[\s\S]*(>>>|\/deep\/)[\s\S]*<\/.*?style.*?>/gm : /(>>>|\/deep\/)/gm
       console.log('存在/deep/', !!str.match(regIncludeDeep));
         if (str.match(regIncludeDeep)) {
         const newStr = str.replace(regIncludeDeep, (s) => {
           let formatS = s.replace(/(\/deep\/|>>>)[^\s]/g, '::v-deep ')
           formatS = s.replace(/(\/deep\/|>>>)[\s]/g, '::v-deep ')
           return formatS
         });
         fs.writeFile(fileName, newStr, (err) => {
           if (!err) {
             resolve()
           }
         });
       } else {
         resolve()
       }
     });
   })
 }
 async function main() {
   const { needToConvertFiles, recentChangedDocuments } = require('./convertStyleToScss-temp')
   startToConvert(needToConvertFiles, recentChangedDocuments);
 }
 
 async function startToConvert(needToConvertFiles, recentChangedDocuments) {
 
   for (let i = 0; i < needToConvertFiles.length; i++) {
       const item = needToConvertFiles[i]
       const target = recentChangedDocuments.find((i) => i.fileName.includes(item.split('./')[1]));
       if (target) {
         console.log('有开发者正在开发该文件，跳过', target.branch, item);
         let data
         try {
           data = fs.readFileSync(item)
         } catch (error) {
           console.log('该文件不存在');
           continue;
         }
         const str = data.toString();
         const target1 = str.match(/([\s\S]*<style.*?lang="stylus".*?>[\s\S]*)(@import\s".*?(.styl|.stylus)")([\s\S]*<\/.*?style.*?>)/)
         // 改！！！应当判断有无scoped，再加scoped
         if (target1) {
           const hasScoped = target1.match(/([\s\S]*<style.*?scoped.*?>[\s\S]*)/)
           fs.writeFileSync(item, target1[1] + target1[3] + 
             `\n<style lang="scss" ${hasScoped ? 'scoped' : ''}>\n${target1[2].replace(/(.styl|.stylus)/, '.scss')};\n</style>\n`)
         }
         continue;
       }
       // pexec(`mkdir -p ./xweb-scss/${item}`)
       console.log('->> converting', item);
       try {
         await pexec(`stylus-conver -d yes -i ${item} -o ${item}`);
         if (item.match(/(.*?)(.styl|.stylus)$/)) {
           console.log('-->>>> delete', item);
           await pexec(`rm -rf ${item}`)
         }
         console.log('->> handleErrorConvert');
         await handleErrorConvert(item);
       } catch (e) {
         console.log('转换出错', e);
       }
       
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
 