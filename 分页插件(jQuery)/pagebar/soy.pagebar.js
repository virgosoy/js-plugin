/**
 * 分页插件(jQuery)
 * author:Soy
 * date:2016-5-18 15:39:23
 * version:1.0
 *///# sourceURL=soy.pagebar.js
//支持重新初始化绑定，经试验事件不会有多个重叠。（= =v0.1版本重叠了好么，当时是怎么实验的。。）
;(function($){
	var Page = function(ele,opts){
		this.$element=ele;
		this.defaults={
			length:0, //数据总个数（用于计算页数）
			pageSize:10, //单页显示大小
			currentPage:1, //当前页，起始为1
			prevText:'上一页', //上一页文本
			nextText:'下一页', //下一页文本
			displayMaxEntries:8 //最大显示按钮数
			//callback:function(pageNo,pageSize){} 
			/*回调函数
			    参数：页数，起始为1
			  	       每页显示个数。 
			 */
		};
		this.options=$.extend({},this.defaults,opts);
		this.totalPage; //总页数
		this.calcTotalPage(); //计算总页数
		this.$first;
		this.$last;
		this.$entries;
		this.$prev;
		this.$next;
		this.$jump;
		this.entriesStatus; //页按钮信息，0-显示全部，1-起始，2-中间，3-结尾

	}
	Page.prototype = {
		init:function(){
			var obj = this;
			this.$first=$('<a>').data('page',1).html('1...').addClass('sy-page').attr('href','javascript:void(0);');
			this.createLast(); //创建尾页按钮
			//console.dirxml(this.$first.data('page')+"=="+this.$last.data('page'));
			this.$prev = this.createPrev();
			this.$next = this.createNext();
			this.$jump = this.createJump();
			this.$entries = this.createEntries();
			//需要重新解绑事件，因为不知为何会多次执行事件，按道理dom对象都是重新创建的，应该不会重复才对。。
			this.drawDiv().addClass('sy-pagebar').off('click').on('click','.sy-page:not(.sy-current)',function(){ 
				//点击事件
				//$(this).addClass('sy-current').siblings('.sy-page').removeClass('sy-current');
				//设置当前页
				obj.change($(this).data('page'));
			});
		},
		//计算总页数
		//参数：length：数据总个数，可选，默认用配置。pageSize：单页显示个数，可选，默认用配置。
		calcTotalPage:function(length,pageSize){
			if(length===undefined) length = this.options.length;
			if(pageSize===undefined) pageSize = this.options.pageSize;
			this.totalPage = Math.max(1,Math.ceil(length/pageSize)) //总页数(至少有1页)
		},
		//创建尾页按钮
		createLast:function(){
			this.$last=$('<a>').data('page',this.totalPage).html('...'+this.totalPage).addClass('sy-page').attr('href','javascript:void(0);');
		},		
		//创建单个按钮
		createEntry:function(pageNo){
			var $entry = $('<a>').data('page',pageNo).html(pageNo).addClass('sy-page').attr('href','javascript:void(0);');
			if(pageNo==this.options.currentPage){
				return $entry.addClass('sy-current');
			}
			return $entry;
		},
		//创建所有页数按钮
		createEntries:function(){
			var $entries = $(''); //jQuery对象数组：页面入口
			var startPage=this._startPage(); //第一个页码
			
			for(var i=0;i<Math.min(this.options.displayMaxEntries,this.totalPage);i++){
				$entries=$entries.add(this.createEntry(startPage+i));
			}
			return $entries;
		},
		//修改页，并触发回调。
		/*参数：
		 * page：可选，指定当前页，会修改this.options.currentPage。
		 * isTrigger：可选，是否触发事件，默认为true。
		 */
		change:function(page,isTrigger){
			isTrigger = isTrigger===undefined?true:isTrigger;
			if(page){ //如果指定了页数
				// 如果不在范围内则取最接近的。
				if(page>this.totalPage){
					page=this.totalPage
				}else if(page<1){
					page=1
				}
				this.options.currentPage=page;
			} 
			this.refreshEntries();
			if(this.options.callback && isTrigger)this.options.callback.call(this.$element,this.options.currentPage,this.options.pageSize);
		},
		//刷新按钮(包括所有单页按钮，尾页，跳转页数)
		refreshEntries:function(){
			if(this.options.displayMaxEntries<this.totalPage || this.$last.data("page")!=this.totalPage){ //总页数大于按钮数，需要重新创建按钮 || 最大页数修改了。
				this.$entries = this.createEntries();
				if(this.$last.data("page")!=this.totalPage){ //如果最大页数修改了
					this.createLast();
					this.$jump.find("span").html(this.totalPage); //修改跳转的页数。
				}
				this.drawDiv();
			}else{ //否则修改当前页按钮即可
				//eq(this.options.currentPage-1+1)，因为首页也是.sy-page，而且是隐藏
				this.$element.find('.sy-page').eq(this.options.currentPage).addClass('sy-current').siblings('.sy-page').removeClass('sy-current');
				this.$jump.find('.sy-input').val(this.options.currentPage);
			}
		},
		//绘制按钮
		drawDiv:function(){
			var arr = [];
			arr=[this.$prev,this.$first,this.$entries,this.$last,this.$next,this.$jump]
			this.$prev.show();
			this.$first.show();
			this.$last.show();
			this.$next.show();
			this.$jump.show();
			if(this.entriesStatus==0){ //只要$entries和$jump
				this.$first.hide();
				this.$last.hide();
			}else if(this.entriesStatus==1){ //不要$first
				this.$first.hide();
				if(this.options.currentPage==1){ //不要$prev
					this.$prev.hide();
				}
			}else if(this.entriesStatus==3){ //不要$last
				this.$last.hide();
				if(this.options.currentPage==this.totalPage){ //不要$next
					this.$next.hide();
				}
			}
			this.$jump.find('.sy-input').val(this.options.currentPage);
			return this.$element
					.children().detach().end()
					.append(arr);
		},
		//设置按钮状态与返回第一个按钮的页数
		_startPage:function(){
			var startPage;
			if(this.options.displayMaxEntries>=this.totalPage){
				//显示页数>=总页数
				this.entriesStatus=0;
				startPage=1;
			}else if(this.options.currentPage <= Math.ceil(this.options.displayMaxEntries/2)){
				//开头
				//console.log("开头 "+startPage);
				this.entriesStatus=1;
				startPage=1;
			}else if(this.options.currentPage >= this.totalPage - Math.floor(this.options.displayMaxEntries/2)){
				//结尾
				//console.log("结尾 "+startPage);
				this.entriesStatus=3;
				startPage=this.totalPage-this.options.displayMaxEntries+1;
			}else{
				//中间
				//console.log("中间 "+startPage);
				this.entriesStatus=2;
				startPage=this.options.currentPage-Math.ceil(this.options.displayMaxEntries/2)+1;
			}
			return startPage;
		},
		//创建上一页按钮
		createPrev:function(){
			var obj=this;
			//因为每次都重新创建不同的dom对象，故事件不会重叠到。
			return $('<a>').addClass('sy-prev').attr('href','javascript:void(0);').html(this.options.prevText).on('click',function(){
				if(obj.options.currentPage>1){
					obj.change(--obj.options.currentPage);
				}
			});;
		},
		//创建下一页按钮
		createNext:function(){
			var obj=this;
			//因为每次都重新创建不同的dom对象，故事件不会重叠到。
			return $('<a>').addClass('sy-next').attr('href','javascript:void(0);').html(this.options.nextText).on('click',function(){
				if(obj.options.currentPage<obj.totalPage){
					obj.change(++obj.options.currentPage);
				}
			});
		},
		//创建跳转
		createJump:function(){
			var obj = this;
			return $('<div>').addClass('sy-jump').append([
				$('<input type="text">').addClass('sy-input').on('keypress',function(e){
					var key = e.which || e.keyCode;
					if(key==13){
						if(1<=$(this).val() && $(this).val()<=obj.totalPage && $(this).val()!=obj.options.currentPage){
							obj.change($(this).val());
						}
					};
				}).on('keyup afterpaste',function(e){
					var key = e.which || e.keyCode;
					//console.log(key);
					if(!((key>=16 && key<=18) || (key>=33 && key<=40))){
						this.value=this.value.replace(/\D/g,'')
						this.value=this.value.replace(/^0+/g,'')
					}
					if(this.value>obj.totalPage){
						this.value=obj.totalPage;
					}
				}),
				'/',
				$('<span>').html(this.totalPage)
			]);
		}
	}
	/* 参数列表将进行改动：
	 * 1	opts		map		配置项映射。会强制重新初始化。（不会触发回调函数）
	 * 
	 * 1	currentPage		number
	 * 2	currentPage,length	number,number	
	 * 2	currentPage,isTrigger	number,boolean	
	 * 3	currentPage,length,isTrigger	number,number,boolean	
	 * 		当前页(0代表不改变),数据总数(可选,默认不变),改变当前页时是否触发回调(可选,默认true)	需初始化才能使用。
	 */
	$.fn.soyPage = function(){
		if(arguments.length=1 && typeof arguments[0]=="object"){ //opts
			//初始化 或 重新初始化
			var page = new Page(this,arguments[0]);
			page.init();
			this.data("soyPage",page); //保存到data
		}else{ //currentPage[,length][,isTrigger]
			if(this.data("soyPage")){ //曾经初始化过 
				var page = this.data("soyPage");
				var isTrigger;
				if(arguments[1]!==undefined){ //xxx,xxx
					if(typeof arguments[1]=="boolean"){ //currentPage,isTrigger
						isTrigger = arguments[1];
					}else{ //currentPage,length[,isTrigger]
						page.calcTotalPage(arguments[1]); //计算总页数
						if(arguments[0]==0)page.refreshEntries(); //刷新按钮
						isTrigger=arguments[2];
					}
				}
				if(arguments[0]!=0)page.change(arguments[0],isTrigger); //改变当前页，也会刷新按钮。
			}else{ //未初始化过
				//报错
				console.error("未初始化，无法使用此参数类型");
				alert("未初始化，无法使用此参数类型");
//				//初始化
//				var page = new Page(this,{currentPage:arguments[0],length:length});
//				page.init();
//				this.data("soyPage",page); //保存到data
			}
		}
		return this;
	}
})(jQuery);