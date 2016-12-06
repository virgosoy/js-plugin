# 分页插件
## 功能概述
一个分页显示的控件，点击页数按钮时触发自定义的回调函数。
## 版本更新
### v1.0 - 2016-5-18 
**此版本不向下兼容**

改动：

* 修改第一层class为：sy-pagebar
* 新的参数列表，不向下兼容
* 可异步加载调试
* 增加功能：无需重新初始化，可设置数据数目或当前页。若设置了当前页则会触发回调函数。

```javascript
	/* 参数列表将进行改动：
	 * 1	opts		map		配置项映射。会强制重新初始化。
	 * 
	 * 1	currentPage		number
	 * 2	currentPage,length	number,number	
	 * 2	currentPage,isTrigger	number,boolean	
	 * 3	currentPage,length,isTrigger	number,number,boolean	
	 * 		当前页(0代表不改变),数据总数(可选,默认不变),改变当前页时是否触发回调(可选,默认true)	需初始化才能使用。
	 */
```

### v0.2 - 2016-5-18

修复bug：

* 多次生成控件(调用$(xxx).soyPage())后会绑定多次事件，导致点击一次执行多次。

### v0.1 - 2016-1-14

基于jQuery

#### 简单使用方法

引入soy_page.css、soy_page.js
```html
	<link rel="stylesheet" href="soy_page.css" />
	<script src="soy_page.js"></script>
```

使用：
定义一个div，如：
```html
<div class="page"></div>
```

然后js脚本：
```javascript
//参数：1为数据个数，2为设置
$(".page").soyPage(length,{
	pageSize:10, //单页显示大小
	currentPage:1, //当前页
	prevText:'上一页', //上一页文本
	nextText:'下一页', //下一页文本
	displayEntries:8, //按钮数
	callback:function(pageNo,pageSize){ //回调函数，页面改变时发生

	}
})
```
