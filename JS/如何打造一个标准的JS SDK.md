
# 如何打造一个标准的JS SDK

参考： https://mp.weixin.qq.com/s?__biz=MzIyMDkwODczNw==&mid=2247497881&idx=1&sn=d128ca25112c01a84d951565b66426d8&chksm=97c66537a0b1ec21b404336cb00c795d875d20c39062f411dd15d6c245921a05d8c3fd5fc73a&scene=21#wechat_redirect

## 确定SDK的引用形式
&emsp;&emsp;这里涉及了模块化的引用知识。
&emsp;&emsp;SDK整体而言是一个大模块，前端模块有多种表现形式：ES Module、CommonJS、AMD/CMD/UMD，而在引用方面则大体分 CDN和 NPM两种。即无论我们实现的是哪种形式的模块，最终都是通过CDN或者NPM的方式提供给用户引用。
UMD结合了COMMONJS和AMD，可同时提供CDN和NPM两种引用方式，给用户更多选择。


```js
// ES Module
import wpkReporter from 'wpkReporter'
// CommonJS
const wpkReporter = require('wpkReporter')
// AMD,requireJS引用
require.config({
  paths: {
    "wpk": "https://g.alicdn.com/woodpeckerx/jssdk/wpkReporter.js",
  }
})
require(['wpk', 'test'], function (wpk) {
  // do your business
})
```
&emsp;&emsp;乍看有点眼花，但事实上今时今日的前端工程领域，已有很多利器可以帮助我们达到目的。比如webpack，通过简单的配置就可以构建出一个UMD的bundle。

```js
// webpack.config.js
module.exports = {
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`,
    globalObject: 'this',
    library: '[name]',
    libraryTarget: 'umd'
  }
}
```

## 确定SDK的版本管理机制

&emsp;&emsp;现有较成熟的版本管理机制当属语义化版本号[2]，表现形式为 {主版本}.{次版本}.{补丁版本}，简单易记好管理。

&emsp;&emsp;一般重大的变更才会触发主版本号的更替，而且很可能新旧版本不兼容。次版本主要对应新特性或者较大的调整，因此也有可能出现breakchange。其他小的优化或bugfix就基本都是在补丁版本号体现。

## 确定SDK的基础接口
接口是SDK和用户沟通的桥梁，每一个接口对应着一个独立的SDK功能，并且有明确的输入和输出。我们可以先来看看岳鹰前端监控SDK的核心接口有哪些？

```js
// 上报相关
wpk.report(logData)
wpk.reportJSError(error)
wpk.reportAPIError(apiData)
// 配置变更
wpk.setConfig(data)
// SDK诊断
wpk.diagnose()
// 添加插件
wpk.addPlugin(plugin)
```

总结接口的设计原则，如下：

- 职责单一
  - 一个接口只做一件事情
- 命名简单清晰，参数尽量少但可扩展
  - 好的接口命名就是最好的注释，一看即明其用处
  - 参数尽可能适用Object封装
- 做好参数校验和逻辑保护



## .....其他见参考链接