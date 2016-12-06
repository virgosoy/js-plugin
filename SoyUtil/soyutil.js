/**工具库
 * @author zhengsiyou
 * version 2.1
 */

var SoyUtil = SoyUtil || {};
SoyUtil = {
	/**
	 * 随机颜色 rgb(255,255,255)
	 * @returns {String}
	 */
	randomColor:function(){
		var r = Math.floor(Math.random()*256);
		var g = Math.floor(Math.random()*256);
		var b = Math.floor(Math.random()*256);
		return "rgb("+r+","+g+","+b+")";//ie7不支持rgb
	},
	/**
	 * 随机颜色 #FFFFFF
	 * @returns {String}
	 */
	randomColor16:function(){
		var r = random(255).toString(16);
		var g = random(255).toString(16);
		var b = random(255).toString(16);
		if(r.length<2)r="0"+r; 
		if(g.length<2)g="0"+g; 
		if(b.length<2)b="0"+b;
		return "#"+r+g+b;
	},
	/**
	 * 随机整数范围 [0,num]
	 * @param {Number} num
	 * @returns
	 */
	random:function(num){
		return Math.floor(Math.random()*(num+1));
	},
	/**
	 * 随机整数范围 [start,end]
	 * @param {Number} start
	 * @param {Number} end
	 * @returns
	 */
	ramdomRange:function(start,end){
		return Math.floor(Math.random()*(end-start+1))+start;
	},
	/**
	 * 设置一个数，如果数字超过边界则返回边界值。(如果左边界大于右边界则返回左边界)
	 * @param {Number} min 左边界
	 * @param {Number} num 数字
	 * @param {Number} max 右边界
	 */
	inRange:function(min,num,max){
		if(min>=max){
			return min;
		}else if(num < min){
			return min;
		}else if(num > max){
			return max;
		}else{
			return num;
		}
	},
	/**
	 * 空判断
	 * @param {Object} val
	 * @returns {Boolean}
	 */
	isEmpty:function(val) {
		val = $.trim(val);
		if (val == null)
			return true;
		if (val == undefined || val == 'undefined')
			return true;
		if (val == "")
			return true;
		if (val.length == 0)
			return true;
		if (!/[^(^\s*)|(\s*$)]/.test(val))
			return true;
		return false;
	},
	/**
	 * 非空判断
	 * @param {Object} content
	 * @returns {Boolean}
	 */
	isNotEmpty:function(val){
		return !isEmpty(val);
	},
	/**
	 * 时间格式化：XXX前。参数：Date对象。
	 * @param {Date} startTime
	 * @returns {String}
	 */
	getTimeFormat:function(startTime){
		var startTimeMills = startTime.getTime();
		var endTimeMills = new Date().getTime();
		var diff = parseInt((endTimeMills - startTimeMills)/1000);//秒
		var day_diff = parseInt(Math.floor(diff/86400));//天
		var buffer = Array();
		if(day_diff<0){
			return "[error],时间越界...";
		}else{
			if(day_diff==0 && diff<60){
				if(diff<=0)diff=1;
				buffer.push(diff+"秒前");
			}else if(day_diff==0 && diff<120){
				buffer.push("1 分钟前");
			}else if(day_diff==0 && diff<3600){
				buffer.push(Math.round(Math.floor(diff/60))+"分钟前");
			}else if(day_diff==0 && diff<7200){
				buffer.push("1小时前");
			}else if(day_diff==0 && diff<86400){
				buffer.push(Math.round(Math.floor(diff/3600))+"小时前");
			}else if(day_diff==1){
				buffer.push("1天前");
			}else if(day_diff<7){
				buffer.push(day_diff+"天前");
			}else if(day_diff <30){
				buffer.push(Math.round(Math.ceil( day_diff / 7 )) + " 星期前");
			}else if(day_diff >=30 && day_diff<=179 ){
				buffer.push(Math.round(Math.ceil( day_diff / 30 )) + "月前");
			}else if(day_diff >=180 && day_diff<365){
				buffer.push("半年前");
			}else if(day_diff>=365){
				buffer.push(Math.round(Math.ceil( day_diff /30/12))+"年前");
			}
		}
		return buffer.toString();
	},
	/**
	 * 阻止事件冒泡
	 * @param {Event} e
	 */
	stopBubble:function(e) {
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation)
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		else
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
	},
	/**
	 * 获取指定月份的天数
	 * @param {Number} year 年份
	 * @param {Number} month 月份，起始月份为1
	 * @returns {Number}
	 */
	getDayOfMonth:function(year,month){
		var date = new Date(year,month,0);
		return date.getDate();
	},
	/**
	 * 获取天数差
	 * @param {Date} date1 日期1
	 * @param {Date} date2 日期2
	 * @returns {Number}
	 */
	dateDiff:function(date1,date2){
		var d1 = new Date(date1);
		var d2 = new Date(date2);
		d1.setHours(0, 0, 0, 0);
		d2.setHours(0, 0, 0, 0);
		var time = d1 - d2;
		return time/86400000;
	},
	/**
	 * 根据增加天数生成日期
	 * @param {Date} date
	 * @param {Number} day
	 * @returns {Date}
	 */
	dateAdd:function(date,day){
		var d = new Date(date);
		d.setDate(d.getDate()+day); 
		return d;
	},
	/*//对Date的扩展，将 Date 转化为指定格式的String
	//月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	//例子： 
	//(new Date()).format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	//(new Date()).format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
	function dateFormat(date,fmt) { //author: meizz 
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"H+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}*/
	/**
	 * 日期格式化
	 * @param {Date} date
	 * @param {String} fmt
	 * @returns {String}
	 */
	dateFormat:function(date,fmt){
		return date.format(fmt);
	},
	/**
	 * 获取当前系统时间
	 * @returns {String} 当前系统时间，格式：YYYY-M-D HH:mm
	 */
	getCurrentDate:function() {
		var date = new Date();
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	}
};

/**
 * 日期格式化
 * @memberOf Date
 * @param {String} fmt
 * @returns {String}
 *
 * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * eg: (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function(fmt) {
	var o = {
		"Y+" : this.getFullYear(),
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,	// 小时
		"H+" : this.getHours(),	// 小时
		"m+" : this.getMinutes(),	// 分
		"s+" : this.getSeconds(),	// 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3),	// 季度
		"S" : this.getMilliseconds() // 毫秒
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
								: "/u5468")
								: "")
								+ week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};