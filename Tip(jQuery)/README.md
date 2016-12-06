
# Tip(jQuery)

## 功能概述

提示框组件，用于鼠标滑动到指定元素时显示提示。

## 兼容性

支持DOM的第四个版本的浏览器。

测试环境：Chrome 54.0.2840.71 m

## 依赖

* 需要jQuery、SoyUtil 2.0
* 需要soy.arrow.css

```jsp
 	<%-- 引入soyTip --%>
	<link type="text/css" rel="stylesheet" href="${basePath}/resources/js/soy/tip/soy.tip.css" />
	<script type="text/javascript" src="${basePath}/resources/js/soy/tip/soy.tip.js"></script>
```

## 版本更新

### v0.4

修复bug：当显示时元素移动离开鼠标时，某些情况下会导致无法触发onmouseleave事件使得元素无法隐藏。

解决方法：鼠标移开提示时同样使提示隐藏。

### v0.3

修复bug：当显示时元素被移除导致无法触发onmouseleave事件使得元素无法隐藏。

解决方法：使用DOM4的突变观察者。

### v0.2

修复bug：显示文本时容易自动换行

实现链式调用

### v0.1

简单使用初始化方法：

```JavaScript
$(xxx).soyTip();
```
