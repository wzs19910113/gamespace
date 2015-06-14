/*
*  ------------------------
*  ----------类----------
*  ------------------------
*/

/*	图片数据元
*	@param src : 初始图片地址
*	@param next : 初始下一个图片数据元
*/
function Inode( src , next ){

	//--------变量--------

	if(src) this.src = src;
	if(next) this.next = next;
	this.img;

	//--------函数--------

	//加载图片
	this.loadImg = function(){
		if(this.src){
			this.img = new Image();
			this.img.src = this.src;
			return true;
		}
		return false;
	}

	this.toString = function(){
		return this.src;
	}
}

/*	图片数据链表
*/
function ImageLoader(){

	//--------变量--------

	this.inode;
	this.loaded = 0;//已加载图片数
	this.amount = 0;//图片总量
	this.imageArray = new Array();//图片数组
	this.i = 0;//interval function

	//--------函数--------

	/*	添加一个图片地址信息
	*	@return Inode : 新的图片数据元
	*/
	this.addImage = function( src ){
		var newInode = new Inode(src);
		if(this.inode){//如果 this.inode 存在
			newInode.next = this.inode;
		}
		this.inode = newInode;
		return newInode;
	}

	//根据图片地址数组 srcs（String） 形成数据链表
	this.setChain = function( srcs ){
		this.inode = new Inode();
		var temp = this.inode;
		var i=0;
		for(;i<srcs.length;i++){
			var tNext = new Inode(srcs[i+1]);
			temp.src = srcs[i];
			if(tNext.src){
				temp.next = tNext;
				temp = temp.next;
			}
			else break;
		}
		this.amount = srcs.length;
		return;
	}

	//获得链表长度
	this.getLength = function(){
		var temp = this.inode;
		var res = 1;
		if(!temp) return 0;
		while(temp.next){
			res++;
			temp = temp.next;
		}
		return res;
	}

	/*
	加载 this.inode 的所有图片
	*/
	this.loadAll = function(){
		var _this = this;
		loadImg(this.inode,this);
		function loadImg(inode,_this){
			inode.loadImg();
			inode.img.onerror=function(){
				alert('An error occurs when loding image : '+inode.img.src);
				window.clearInterval(_this.i);
				return false;
			}
			inode.img.onload=function(){
				_this.loaded++;
				if(inode.next&&inode.next.src){
					loadImg(inode.next,_this);}
			};
		}
		return true;
	}

	/*	遍历全部元件并执行动作
	*	@param func(Inode) : 执行的动作
	*/
	this.traverse = function( func ){
		var temp = this.inode;
		if(temp) func(temp);
		while(temp.next){
			temp = temp.next;
			func(temp);
		}
		return;
	}

	//根据 src 获得 Image
	this.getImage = function( src ){
		var temp = this.inode;
		if(temp.src === src){
			return temp.img;
		}
		while(temp.next){
			if(temp.next.src === src){
				return temp.next.img;
			}
			else temp = temp.next;
		}
		return;
	} 

	//根据 src 删除 Image
	this.deleteImage = function( src ){
		var temp = this.inode;
		var res = "not found";
		if(temp.src === src){
			this.inode = temp.next;
			res = this.inode;
		}
		else{
			while(temp.next){
				if(temp.next.src === src){
					res = temp.next;
					temp.next = temp.next.next;
				}
				else temp = temp.next;
			}
		}
		return res;
	} 

	//获得加载进度的数值（ 最大为 100 ），没有图片时返回 -1
	this.progress = function(){
		return this.amount!=0?Math.round((this.loaded/this.amount)*100):-1;
	}

	//获得加载进度的百分比字符串，没有图片时返回 “-”
	this.progressStr = function(){
		return this.amount!=0?Math.round((this.loaded/this.amount)*100)+"%":"-";
	}

	/*
	*	在加载过程中以 timeUnit（毫秒） 为时间单位重复执行函数 itvFunc，加载结束时执行函数 endFunc
	*/
	this.extend = function( itvFunc, endFunc, timeUnit ){
		var time = 0;
		var _timeUnit = 250;
		if(timeUnit) _timeUnit = timeUnit;
		var _this = this;
		_this.i = setInterval(function(){
			time++;
			itvFunc();
			if(_this.loaded>=_this.amount){
				window.clearInterval(_this.i);
				endFunc();
			}
		},_timeUnit);
		return;
	}

	this.toString = function(){
		var temp = this.inode;
		var text = temp+" | ";
		var total = 1;
		while(temp.next){
			total += 1;
			text += temp.next+" | ";
			temp = temp.next;
		}
		return total+" : "+text;
	}
}