;/**
 * tip(提示组件)
 * @author zhengsiyou
 * @version 0.4
 *///# sourceURL=soy.tip.js
//参数设置可查看 Tip.prototype.defaults
(function($){
	function Tip($ele,options){
		//属性：提示组件DOM jQuery对象
		this.$tip = $("<div class='sy-tip'>"+
				"	<div class='sy-tip-box'>"+
				"		<div class='sy-tip-content'></div>"+
				"		<div class='sy-tip-arrow'></div>"+
				"	</div>"+
				"</div>")
		
		//属性：此DOM jQuery对象
		this.$ele = $ele;
		//属性：配置参数
		this.opts = $.extend({},this.defaults,options);
		//属性：提示内容。
		this.content = this.opts.content; 
		if(SoyUtil.isEmpty(this.content)) this.content = $ele.attr("title");
		if(SoyUtil.isEmpty(this.content)) this.content = $ele.attr("alt");
		if(SoyUtil.isEmpty(this.content)) this.content = $ele.text();
		if(SoyUtil.isEmpty(this.content)) this.content = "这是提示";
		//属性：事件监听器函数
		this.eventListener = {};
		//属性：突变观察者
		this.observer = null;
		
		//UI
		this.$tip.find(".sy-tip-box").css({background:this.opts.background});
		this.$tip.find(".sy-tip-arrow").css({borderWidth:this.opts.arrowSize,borderColor:this.opts.background});
		
		//绑定事件
		this.bindEvents(this.opts.eventType);
		
	}
	/**
	 * 默认值
	 */
	Tip.prototype.defaults = {
		//content: //提示内容。
		eventType:"hover", //事件触发类型
		arrowSize:8, //箭头大小（即border-width）
		background:"#333", //背景颜色，包括箭头的border-color。
		color:"#fff" //字体颜色
	}
	/**
	 * 绑定事件
	 * @param eventType 事件类型名
	 */
	Tip.prototype.bindEvents = function(eventType){
		var that = this;
		if(eventType=="hover"){
			this.eventListener.handleEvent = function(e){
				if(e.type=="mouseenter"){
					that.show();
				}else if(e.type=="mouseleave"){
					that.hide();
				}
			}
			this.$ele[0].addEventListener("mouseenter",this.eventListener);
			this.$ele[0].addEventListener("mouseleave",this.eventListener);
			//鼠标移出提示也对提示进行隐藏
			this.$tip.find(".sy-tip-content")[0].addEventListener("mouseleave",this.eventListener);
		}else{
			this.eventListener.handleEvent = function(e){
				that.tigger();
			}
			this.$ele[0].addEventListener(eventType,this.eventListener);
		}
		
		//如果支持DOM4的MutationObserver
		if(window.MutationObserver){
			//创建观察者对象
			this.observer = new MutationObserver(function(records){
				records.forEach(function(record){
					record.removedNodes.forEach(function(node){
						if(node==that.$ele[0]){
							that.destroy();
						}
					});
				});
			});
			this.observer.observe(this.$ele.parent()[0],{childList:true})
		}
	}
	/**
	 * 解绑事件
	 */
	Tip.prototype.unbindEvent = function(eventType){
		if(eventType=="hover"){
			this.$ele[0].removeEventListener("mouseenter",this.eventListener);
			this.$ele[0].removeEventListener("mouseleave",this.eventListener);
			this.$tip.find(".sy-tip-content")[0].addEventListener("mouseleave",this.eventListener);
		}else{
			this.$ele[0].removeEventListener(eventType,this.eventListener);
		}
		if(window.MutationObserver){
			this.observer.disconnect();
		}
	}
	/**
	 * 显示Tip
	 */
	Tip.prototype.show = function(){
		$("body").append(this.$tip);
		var $content = this.$tip.find(".sy-tip-content");
		var $arrow = this.$tip.find(".sy-tip-arrow");
		
		$content.html(this.content); //插入内容
		
		var arrowSize = this.opts.arrowSize;
		
		//大小计算
		var cw = $content.outerWidth();
		var ch = $content.outerHeight();
		
		var st = $(document).scrollTop();
		var sl = $(document).scrollLeft();
		var ww = $(window).width();
		var wh = $(window).height();

		var eOffset = this.$ele.offset();
		var et = eOffset.top;
		var el = eOffset.left;
		var ew = this.$ele.outerWidth();
		var eh = this.$ele.outerHeight();

		//判断目标元素四周空闲大小
		var spaceTop = et - st;
		var spaceLeft = el - sl;
		var spaceBottom = st + wh - et - eh;
		var spaceRight = sl + ww - el - ew;
		
		//确定显示位置
		var showPositionFlag = 0;
		//如果上下显示得下，那么宽度已经显示最大了
		if( (ch + arrowSize) < spaceTop ){
			showPositionFlag = 0
		}else if( (ch + arrowSize) < spaceBottom ){
			showPositionFlag = 1;
		}else{ //如果上下显示不下，那么看看左右是否显示得下
			//如果左右显示得下，那么高度已经显示最大了
			if( (cw + arrowSize) < spaceLeft ){
				showPositionFlag = 2;
			}else if( (cw + arrowSize) < spaceRight ){
				showPositionFlag = 3;
			}else{ //如果左右都显示不下，则表示此内容区域太大，显示在最空闲的地方算了
				showPositionFlag = 4;
				if(spaceTop<spaceBottom){ //显示在下方
					showPositionFlag |= 1;
				}
				if(spaceLeft<spaceBottom){ //显示在右边
					showPositionFlag |= 2;
				}
				
			}
		}
		//根据显示位置显示内容
		var ct,cl; //内容offset的top和left
		var at,al; //箭头offset的top和left;
		$arrow.removeClass("sy-c-arrow sy-c-arrow-down sy-c-arrow-up sy-c-arrow-left sy-c-arrow-right"); //重新设置箭头class
		switch(showPositionFlag){
		case 0: //上
			cl = SoyUtil.inRange(sl, el+ew/2-cw/2, sl+ww-cw);
			ct = et - ch - arrowSize;
			$arrow.addClass("sy-c-arrow sy-c-arrow-down");
			al = el + ew/2 - arrowSize;
			at = et - arrowSize;
			break;
		case 1: //下
			cl = SoyUtil.inRange(sl, el+ew/2-cw/2, sl+ww-cw);
			ct = et + eh + arrowSize;
			$arrow.addClass("sy-c-arrow sy-c-arrow-up");
			al = el + ew/2 -arrowSize;
			at = et + eh - arrowSize;
			break;
		case 2: //左
			cl = el - cw - arrowSize;
			ct = SoyUtil.inRange(st, et+eh/2-ch/2, st+wh-ch);
			$arrow.addClass("sy-c-arrow sy-c-arrow-right");
			al = el - arrowSize;
			at = et + eh/2 - arrowSize;
			break;
		case 3: //右
			cl = el + ew + arrowSize;
			ct = SoyUtil.inRange(st, et+eh/2-ch/2, st+wh-ch);
			$arrow.addClass("sy-c-arrow sy-c-arrow-left");
			al = el + ew - arrowSize;
			at = et + eh/2 - arrowSize;
			break;
		case 4: //左上
			cl = sl;
			ct = st;
			break;
		case 5: //左下
			cl = sl
			ct = st + wh;
			break;
		case 6: //右上
			cl = sl + ww;
			ct = st;
			break;
		case 7: //右下
			cl = sl + ww;
			ct = st + wh;
			break;
		}
		this.$tip.find(".sy-tip-box").offset({top:ct,left:cl});
		$arrow.offset({top:at,left:al});
		
	}
	/**
	 * 隐藏Tip
	 */
	Tip.prototype.hide = function(){
		this.$tip.remove();
	}
	/**
	 * 切换Tip
	 */
	Tip.prototype.tigger = function(){
		if($("body").find(this.$tip[0]).length == 0){ //即此对象不存在
			this.show();
		}else{
			this.hide();
		}
	} 
	/**
	 * 销毁
	 */
	Tip.prototype.destroy = function(){
		this.unbindEvent(this.opts.eventType);
		this.hide();
	}
	
	$.fn.soyTip = function(options){
		new Tip(this,options);
		return this;
	}
})(jQuery);