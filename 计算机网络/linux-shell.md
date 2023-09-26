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

### cron
> 使用场景：命令是需要周期性执行的操作或者一个可执行的脚本文件。例如，"*/5 * * * * /usr/local/test.sh"表示每5分钟执行一个名为test.sh的脚本文件。
> 例如：使用crontab每30分钟执行一次ping命令：
*/30 * * * * ping -c 3 http://www.baidu.com

cron是系统的调度进程，可在无人干预的情况下运行作业，通过crontab的命令允许用户提交，编辑或者删除相应的作业。
每个用户都可以有一个crontab文件来保存调度信息，通过该命令运行任意一个shell脚本或者命令
在大的系统中，系统管理员可以通过/etc/cron.allow和/etc/cron.deny这两个文件来禁止或允许用户拥有自己的crontab文件
```
crontab的域
第1列 分钟0～59
第2列 小时0～23(0表示子夜)
第3列 日1～31
第4列 月1～12
第5列 星期0～6(0表示星期天)
第6列 要运行的命令
```

crontab格式： `分<>时<>日<>月<>星期<>要运行的命令`，<>表示空格
如果需要每隔30分钟执行一次命令或任务: `*/30 * * * * command`


note：如果要表示范围的话，如周一到周五，可以用1-5表示
如果要列举某些值,如周一、周五，可以用1,5表示

```
30  21  *  *  *  /apps/bin/cleanup.sh
0,30  18-23  *  *  *  /apps/bin/dbcheck.sh
```
![](PICTURES/linux-shell/2023-09-26-13-56-55.png)

  
1、每隔1分钟执行一次：
```
* * * * * command
```
2、每隔2小时执行一次：
```
0 */2 * * * command
```
3、每日凌晨1点执行一次：
```
0 1 * * * command
```
4、每周日凌晨1点执行一次：
```
0 1 * * 0 command
```
5、每个月的第一天清空日志文件：
0 0 1 * * echo "" > /var/log/mylog.log


crontab的命令选项
格式：`crontab [ -u user ] -e -l -r`
其中
- -u 用户名,如果使用自己的名字登陆，就不用使用-u选项
- -e 编辑crontab文件
- -l 列出crontab文件中的内容
- -r 删除crontab文件

使用方式：
创建一个新的crontab文件
1、创建一个文件，建议名为cron,例shifengcron,在文件中假如如下内容：
```
* * * * * echo "hello boy" >> xxxx/github-notes/demo/linux-shell/demoCrontabOutput
```
每分钟输出"hello boy"
![](PICTURES/linux-shell/2023-09-26-14-50-29.png)

2、此时还没有开始运行，需要调用`crontab -e`才会开始触发
2、当“crontab -e”编辑完成之后，一旦保存退出，那么这个定时任务实际就会写入 /var/spool/cron/ 目录中，每个用户的定时任务用自己的用户名进行区分。
可通过`crontab -l`查看
![](PICTURES/linux-shell/2023-09-26-14-21-56.png)
此时，每过一分钟就会执行了


### at
at命令允许用户向cron守护进程提交作业，使其在稍后的时间运行，这个时间可以是10min以后，也可能是几天以后，但如果时间比较长，建议还是使用crontab
格式：`at [ -f script ] [ -m -l -r ] [ time ] [ date ]`

- -f script 是要提交的脚本或命令
- -m 作业完成后给用户发邮件
- -r 清除某个作业，需要提供作业标识id
- time 作业执行的时间格式可以为：HH. MM ,HH:MM
- H代表小时，M代表分钟
- date 日期格式可以是月份数或日期数，而且at命令可以识别诸如today，tomorrow这样的词

可以通过命令行方式或者at命令提示符方式来提交作业，一般来讲，如果提交多个命令，可以使用at命令提示符；如果提交的是shell脚本，可以使用命令行方式
例：提示符方式：

```bash
$ at 01:15
echo “hello”
echo “boy”  >/home/wuxh/at.log
```
完成后按ctrl+d提交
> note：EOT是Ctrl+D,任务执行后，会给当前用户发送邮件，通过mail命令可以查看相关信息,也可以将信息重定向到文件

`at -l`和`at -r`的使用
![](PICTURES/linux-shell/2023-09-26-14-49-32.png)


### &
当在前台运行某个作业时，终端被该作业占据；而当它在后台运行时，它不会占据终端
可以借助&命令把作业放到后台执行
格式： `命令 &`

注意：
1 .需要用户交互的命令不要放在后台执行，否则机器一直等待
2 .后台程序在执行时，执行结果仍然会输出到屏幕，干扰我们的工作，建议将这样的信息重定向到某个文件

即：`command > out.file 2>&1 &`
将标准输入错误输出都定向到一个out.file的文件中
例：

```bash
$ find /etc/ -name "hello" -print >find.dt 2>&1 &
```
其中2>&1可见[标准输入，输出和错误]

## 引号

### ""双引号/''单引号
可引用除字符\$\,\`,\外的任意字符或者字符串,对$,`,\敏感
单引号和双引号的用法基本类似，不同的是单引号对特殊字符不敏感，可以将其做为普通字符输出出来

```bash
$ echo "`V_V`"  //想输出`V_V`字样    结果得到错误信息
$ echo "\`V_V\`"    //得到`V_V`输出

$ echo '$$'               //结果 $$  不用借助\进行屏蔽
$ echo '`V_V`'          //结果`V_V`,和前面双引号比较

```

### ``反引号
该命令用于设置系统命令的输出到变量，shell将反引号中的内容做为命令执行

```bash
$ echo `hello`
# OUTPUT : -bash: hello: command not found

$ echo `date`
# OUTPUT : 2021年 1月17日 星期日 23时40分18秒 CST

$ echo "The date today is `date`"
The date today is 2021年 1月17日 星期日 23时41分15秒 CST

```

### 反斜线\
果一个字符有特殊含义，为防止shell误解其含义，可用\屏蔽该字符

> 具有特殊含义的字符: & * ^ $ ` “ |


## 变量

### 系统变量
系统变量适用于所有用户进程，可以在命令行中设置，但用户注销时这些值将丢失，最好在.bash_profile中进行定义，或者/etc/profile
传统上，所有环境变量都大写，且必须用export命令导出

```bash
# 设置环境变量：
var_name=value; export var_name
# 或者：
var_name=value
export var_name
# 又或者# 
export var_name=value
# 查看环境变量：
echo $var_name
```

- `env` 该命令可查看所有系统环境变量
- `unset var_name` 清除系统环境变量

嵌入shell变量
一般来讲，bourne shell有一些预留的环境变量名，这些变量名不能做其他用途，通常在/etc/profile中建立这些嵌入的环境变量，但这不绝对，取决于用户
shell的变量列表：
`CDPATH; EXINIT; HOME; IFS; LOGNAME; MAIL;MAILCHECK; PATH; PS1; PS2; SHELL; TERMINFO;TERM; TZ`

### 用户变量
在用户shell生命周期的脚本中使用，不同的用户可以定义各自的用户变量 ~/.bashrc
```
var_name=value
```
==!!!注意变量=两边不能有空格==

```bash
testVar=23
# OK
testVar = 23
# OUTPUT: command not found: testVar
```


使用
```bash
echo $var_name
or  echo ${var_name}   //建议使用
```
清除变量：
```bash
unset var_name
```

显示用户所有变量：`set`
测试变量是否设置：`echo ${var:=value}` 若未设置或未初始化，可用新值

使用变量保存系统命令参数
例：

```bash
$ SOURCE="/etc/passwd"
$ DEST="/home/chenshifeng/
$ cp $SOURCE $DEST	
```

设置只读变量
可设置某个变量为只读方式，只读变量不可更改，否则系统返回错误
用法：

```bash
var_name=value
readonly var_name  
``` 

### 位置变量
位置变量属于只读变量
作用：向shell脚本传递参数，参数个数可以任意多，但只有前9个被访问到，shift命令可以更改这个限制。
每个访问参数前加$，
第一个参数为0，表示预留保存实际脚本名字，无论脚本是否有参数，此值均可用,如：给脚本test传递信息：
例如：Would you like to do it
![](PICTURES/linux-shell/2023-09-26-16-18-38.png)

例：$ vi test

```bash
#!/bin/sh
echo "The full name is : $0 "
echo "The script name is : `basename $0`"
echo "The first parameter is :$1"
echo "The second parameter is :$2"
echo "The third parameter is :$3"
echo "The fourth parameter is :$4"
echo "The fifth parameter is :$5"
echo "The sixth parameter is :$6"
echo "The seventh parameter is :$7"
echo "The eighth parameter is :$8"
echo "The ninth parameter is :$9"
```
保存文件，执行 `$ ./test would you like to do it`

```bash
The full name is : ./test 
The script name is : test
The first parameter is :would
The second parameter is :you
The third parameter is :like
The fourth parameter is :to
The fifth parameter is :do
The sixth parameter is :it
The seventh parameter is :
The eighth parameter is :
The ninth parameter is :
```

> note：上例中$0返回的信息中包含路径名，如果只想得到脚本名称，可以借助basename,将脚本中第一句修改为：
echo "The script name is : \`basename \$0\` "
保存文件，执行 ./test would you like to do it

> note：basename 用``向系统命令传递参数

可以在脚本中向系统命令传递参数

```
$ vi findfile
#!/bin/sh
find / -name  $1
```


保存，执行

```bash
$ ./findfile  passwd
```

相当于执行了：
```bash
find / -name passwd
```

// demoParam.sh
```bash
echo "hello"
echo "filename:$0"
echo "last result:$?"
echo "all parameters:$*"
echo "all parameters:$@"
echo "count parameters:$#"
echo "pid:$$"
echo "first para:$1"
echo "second para:$2"
```

若执行` ./demoEcho.sh`
报错：`OUTPUT: permission denied: ./demoEcho.sh`

可：修改文件权限：所有用户添加执行权限
`chmod a+x demoEcho.sh`


执行：
```bash
./demoEcho.sh param1 param2 param3`
```

结果：
```
hello
filename:./demoEcho.sh
last result:0
all parameters:param1 param2 param3
all parameters:param1 param2 param3
count parameters:3
pid:33810
first para:param1
second para:param2
```


### 特定变量
特定变量属于只读变量，反映脚本运行过程中的控制信息
特定的shell变量列表：

![](PICTURES/linux-shell/2023-09-26-16-32-05.png)

\$# / $* 见上面的例子


### 用户变量可用来自定义命令行缩写
例如可以创建命令行的简写：
```
alias ga='git add .'
alias gpull='git pull'
alias gpush='git push'
alias gm='git merge'
alias gp-rb='git pull --rebase'
alias gc='git commit -m '
alias gc-nf='git commit -m --no-ff'
alias gch='git checkout'
alias gch-b='git checkout -b'
alias glog='git log'
alias gb='git branch'
alias gb-a='git branch -a'
alias gb-D='git branch -D'
alias gpo-D='git push origin --delete'
alias gpo='git push origin'
```
此时，在命令行输入`ga`实际是调用了`git add .`
