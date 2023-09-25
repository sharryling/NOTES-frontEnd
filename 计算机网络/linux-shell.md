# Linux Shell
> 参考： https://www.cnblogs.com/feng0815/p/14290418.html

## Shell vs Bash

shell是运行在终端中的文本互动程序，bash（GNU Bourne-Again Shell）是最常用的一种shell。是当前大多数Linux发行版的默认Shell。

Shell相当于是一个翻译，把我们在计算机上的操作或我们的命令，翻译为计算机可识别的二进制命令，传递给内核，以便调用计算机硬件执行相关的操作；同时，计算机执行完命令后，再通过Shell翻译成自然语言，呈现在我们面前。

最开始在Unix系统中流行的是sh，而bash作为sh的改进版本，提供了更加丰富的功能。一般来说，都推荐使用bash作为默认的Shell。


## 常见命令

### echo
echo命令可以显示文本行或变量取值，或者把字符串输入到文件中
格式： echo string
echo的常用功能：\c 不换行 \f 不进纸 \t 跳格 \n 换行

note：
对于linux系统，必须使用-e选项来使以上转义符生效

例：
```shell
$ echo  -e  "hello\tboy"
hello	boy
```
echo命令对特殊字符敏感，如果要输出特殊字符，需要用\屏蔽其特殊含义。
常用的特殊字符：双引号"" 反引号`` 反斜线\
例：

```shell
$ echo "\"\""      //想输出""
""
```


### read
read命令从键盘或者文件的某一行文本中读入信息，并将其赋给一个变量。
如果只指定了一个变量，read会把所有的输入赋给该变量，直至遇到第一个文件结束符或回车
格式： read var1 var2 …
例1:
```shell
$ read name
Hello I am superman # 这里是手动输入的内容
$ echo $name
Hello I am superman
```
如果输入的值个数多于变量个数，多余的值会赋给最后一个变量：
例2:
```shell
$ read name surname
John Mike Kate
$ echo $surname   
Mike Kate
$ 
```


### cat

cat可以用来显示文件，并且支持将多个文件串连接后输出

note：该命令一次显示完整个文件，若想分页查看，需使用more

格式： cat [ options ] filename1 … filename2 …
常用options：

- -v 显示控制字符
- -n 对所有输出行进行编号
- -b 与-n相似，但空白行不编号
例：

```shell
$ cat  file1 file2 file3       // 同时显示三个文件
$ cat –b file1 file2 file3
```


### 管道 |
可以通过管道把一个命令的输出传递给另外一个命令做为输入
格式： 命令1 | 命令2
例：

```bash
$ cat linux-shell.md | grep '管道'
```

### tee

把输出的一个副本输送到标准输出，另一个副本拷贝到相应的文件中
如果想看到输出的同时，把输出也同时拷入一个文件，这个命令很合适
格式： `tee -a file`

- -a 表示文件追加到末尾
- file 表示保存输出信息的文件，可自定义文件类型，例如demo.txt
tee命令一般和管道符|结合起来使用
例：

```bash
$ who | tee who.info      // 该命令的信息返回在屏幕上，同时保存在
```
文件who.info中
```bash
$ who | tee who.info
chenshifeng console  Jan  9 12:56 
chenshifeng ttys000  Jan  9 13:27 
chenshifeng ttys004  Jan  9 19:11 
chenshifeng ttys005  Jan 10 00:12 
$ cat who.info 
chenshifeng console  Jan  9 12:56 
chenshifeng ttys000  Jan  9 13:27 
chenshifeng ttys004  Jan  9 19:11 
chenshifeng ttys005  Jan 10 00:12
```


### 标准输入，输出和错误

当我们在shell中执行命令的时候，每个进程都和三个打开的文件相联系，并使用文件描述符来引用这些文件，见下表

![](PICTURES/linux-shell/2023-09-25-16-49-55.png)
常用文件重定向命令：
```bash
command > file：                   标准输出重定向到一个文件,错误仍然输出屏幕
command >> file：                  标准输出重定向到一个文件(追加)
command 1> file：                  标准输出重定向到一个文件
command 2>> file：                 标准错误重定向到一个文件(追加) 
command >file 2>&1：               标准输出和标准错误一起重定向到一个文件
command >>file 2>&1：              标准输出和标准错误一起重定向到一个文件(追加)
command < file1 >file2：           以file1做为标准输入，file2做为标准输出
command <file：                    以file做为文件标准输入  
```

\>> 追加就是：在文件内容后面增加内容
\> 就是新建/全文替代

结合使用标准输出和标准错误

```bash
$ cat linux-shell.md 1>myfile.out  2>myerror.out 
```

合并标准输出和标准错误

```bash
$ cat >>mylog.out  2>&1  <hello
```


## shell后台执行命令