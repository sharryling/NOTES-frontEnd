# git使用

## 不同项目配置不同的 Git 账号
参考：https://segmentfault.com/a/1190000017932264

- 解决
由于电脑上 Github 仓库比较多，所以我将全局 name 和 email 设置成我的 Github 账号。
```
$ git config --global user.name "Linda0821"
$ git config --global user.email "Linda0821@gmail.com"
```
这时打开电脑上任意一个 Git 仓库，输入：
```
$ git config --list
```
都会看到 user.name 和 user.email 用的都是全局的。

然后进入公司项目里，进行特殊设置：
```
$ git config user.name "xiaojia"
$ git config user.email "xiaojia@jd.com"
```