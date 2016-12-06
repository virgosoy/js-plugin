
# SoyUtil

## 功能概述

一个工具类。。。

## 依赖

部分方法需要jQuery。

## 版本更新

### v2.1

修复bug：dateFormat()无返回值。

新增方法：getCurrentDate()	获取当前系统时间，格式：YYYY-M-D HH:mm

### v2.0 

**不与上一个版本兼容。**

放到命名空间SoyUtil里面。

新增方法：inRange(min,num,max)	设置一个数，如果数字超过边界则返回边界值。

### v1.3

新增方法：

* dateDiff(date1,date2)	获取天数差
* dateAdd(date,day)	根据增加天数生成日期
* dateFormat(date,fmt)	日期格式化
* Date.prototype.format = function(fmt) 日期格式化

### v1.2

新增方法：getDayOfMonth	获取指定月份的天数
