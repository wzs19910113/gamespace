//恒量

//砖块（横坐标，纵坐标，半径，颜色）
function Brick(x,y,r,color)
{
	//--------变量--------
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.ltx = this.lty = this.rtx = this.rty = this.rbx = this.rby = this.lbx = this.lby = 0;//四顶点坐标
	this.tstep = 0;//上边界的位移长度
	this.bstep = 0;//下边界的位移长度
	this.falling = false;//正在下落
	this.isStatic = true;//稳定
	this.color = "white";
	
	if(x) this.x = x;
	if(y) this.y = y;
	if(r) this.r = r;
	if(x&&y&&r){
		this.ltx = x-r;
		this.lty = y-r;
		this.rtx = x+r;
		this.rty = y-r;
		this.rbx = x+r;
		this.rby = y+r;
		this.lbx = x-r;
		this.lby = y+r;
	}
	if(color) this.color = color;
	
	//--------函数--------
	this.toString = function(){
		return this.x+"-"+this.y+" : "+this.r+" ["+this.color+"]";
	}
	
	//复制
	this.copy = function(){
		var res = new Brick();
		res.x=this.x;
		res.y=this.y;
		res.r=this.r;
		res.ltx=this.ltx;
		res.lty=this.lty;
		res.rtx=this.rtx;
		res.rty=this.rty;
		res.rbx=this.rbx;
		res.rby=this.rby;
		res.lbx=this.lbx;
		res.lby=this.lby;
		res.tstep=this.tstep;
		res.bstep=this.bstep;
		res.color=this.color;
		res.falling=this.falling;
		return res;
	}
	
	//旋转（中心点x，中心点y，角度）
	this.rotate = function(centX,centY,deg){
		var ltpos = rotate(centX,centY,this.ltx,this.lty,deg);
		var rtpos = rotate(centX,centY,this.rtx,this.rty,deg);
		var rbpos = rotate(centX,centY,this.rbx,this.rby,deg);
		var lbpos = rotate(centX,centY,this.lbx,this.lby,deg);
		this.ltx = ltpos.x;
		this.lty = ltpos.y;
		this.rtx = rtpos.x;
		this.rty = rtpos.y;
		this.rbx = rbpos.x;
		this.rby = rbpos.y;
		this.lbx = lbpos.x;
		this.lby = lbpos.y;
	}
	
	//位移
	this.shift = function(){
		this.lty += this.tstep;
		this.rty += this.tstep;
		this.lby += this.bstep;
		this.rby += this.bstep;
	}

	//更新向左旋转90度后的数据
	this.updTurnLeft = function(){
		var oltx=this.ltx;//原来的ltx
		var olty=this.lty;//原来的lty
		this.ltx=Math.round(this.rtx);
		this.lty=Math.round(this.rty);
		this.rtx=Math.round(this.rbx);
		this.rty=Math.round(this.rby);
		this.rbx=Math.round(this.lbx);
		this.rby=Math.round(this.lby);
		this.lbx=Math.round(oltx);
		this.lby=Math.round(olty);
	}
	
	//更新向右旋转90度后的数据
	this.updTurnRight = function(){
		var oltx=this.ltx;//原来的rbx
		var olty=this.lty;//原来的rby
		this.ltx=Math.round(this.lbx);
		this.lty=Math.round(this.lby);
		this.lbx=Math.round(this.rbx);
		this.lby=Math.round(this.rby);
		this.rbx=Math.round(this.rtx);
		this.rby=Math.round(this.rty);
		this.rtx=Math.round(oltx);
		this.rty=Math.round(olty);
	}
	
	//更新翻转后的数据
	this.updFlip = function(){
		var oltx=this.ltx;
		var olty=this.lty;
		var ortx=this.rtx;
		var orty=this.rty;
		this.ltx=this.lbx;
		this.lty=this.lby;
		this.rtx=this.rbx;
		this.rty=this.rby;
		this.lbx=oltx;
		this.lby=olty;
		this.rbx=ortx;
		this.rby=orty;
	}
}

//方格（ID，横坐标，纵坐标，半径）
function Square(id,x,y,r)
{
	//--------变量--------
	this.id = 0;
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.ltx = this.lty = this.rtx = this.rty = this.rbx = this.rby = this.lbx = this.lby = 0;//四顶点坐标
	this.tstep = 0;//上边界的位移长度
	this.bstep = 0;//下边界的位移长度
	this.empty = true;//含有砖块
	this.brick = new Brick();//砖块
	this.up = 0;//上面的方格ID 0：不存在
	this.down = 0;//下面
	this.left = 0;//左边
	this.right = 0;//右边
	this.text = "";
	this.fontSize = 12;
	
	if(id) this.id=id;
	if(x) this.x=x;
	if(y) this.y=y;
	if(r) this.r=r;
	if(x&&y&&r){
		this.ltx = x-r;
		this.lty = y-r;
		this.rtx = x+r;
		this.rty = y-r;
		this.rbx = x+r;
		this.rby = y+r;
		this.lbx = x-r;
		this.lby = y+r;
	}
	
	//--------函数--------
	this.toString = function(){
		return "("+this.id+")"+this.x+"-"+this.y+"-["+(this.empty?"":this.brick)+"]";
	}
	
	//复制
	this.copy = function(){
		var res = new Square();
		res.id=this.id;
		res.x=this.x;
		res.y=this.y;
		res.r=this.r;
		res.ltx=this.ltx;
		res.lty=this.lty;
		res.rtx=this.rtx;
		res.rty=this.rty;
		res.rbx=this.rbx;
		res.rby=this.rby;
		res.lbx=this.lbx;
		res.lby=this.lby;
		res.tstep=this.tstep;
		res.bstep=this.bstep;
		res.empty=this.empty;
		res.up=this.up;
		res.down=this.down;
		res.right=this.right;
		res.left=this.left;
		res.brick=this.brick.copy();
		return res;
	}
	
	//旋转（中心点x，中心点y，角度）
	this.rotate = function(centX,centY,deg){
		var ltpos = rotate(centX,centY,this.ltx,this.lty,deg);
		var rtpos = rotate(centX,centY,this.rtx,this.rty,deg);
		var rbpos = rotate(centX,centY,this.rbx,this.rby,deg);
		var lbpos = rotate(centX,centY,this.lbx,this.lby,deg);
		this.ltx = ltpos.x;
		this.lty = ltpos.y;
		this.rtx = rtpos.x;
		this.rty = rtpos.y;
		this.rbx = rbpos.x;
		this.rby = rbpos.y;
		this.lbx = lbpos.x;
		this.lby = lbpos.y;
		
		this.brick.rotate(centX,centY,deg);
	}

	//位移
	this.shift = function(){
		this.lty += this.tstep;
		this.rty += this.tstep;
		this.lby += this.bstep;
		this.rby += this.bstep;
		this.brick.shift();
	}

	//更新向左旋转90度后的数据
	this.updTurnLeft = function(){
		var oltx=this.ltx;//原来的ltx
		var olty=this.lty;//原来的lty
		this.ltx=Math.round(this.rtx);
		this.lty=Math.round(this.rty);
		this.rtx=Math.round(this.rbx);
		this.rty=Math.round(this.rby);
		this.rbx=Math.round(this.lbx);
		this.rby=Math.round(this.lby);
		this.lbx=Math.round(oltx);
		this.lby=Math.round(olty);
		this.brick.updTurnLeft();
		
		var oup=this.up;//原来的上方方格
		this.up=this.right;
		this.right=this.down;
		this.down=this.left;
		this.left=oup;
	}
	
	//更新向右旋转90度后的数据
	this.updTurnRight = function(){
		var oltx=this.ltx;//原来的rbx
		var olty=this.lty;//原来的rby
		this.ltx=Math.round(this.lbx);
		this.lty=Math.round(this.lby);
		this.lbx=Math.round(this.rbx);
		this.lby=Math.round(this.rby);
		this.rbx=Math.round(this.rtx);
		this.rby=Math.round(this.rty);
		this.rtx=Math.round(oltx);
		this.rty=Math.round(olty);
		this.brick.updTurnRight();
		
		var oup=this.up;//原来的上方方格
		this.up=this.left;
		this.left=this.down;
		this.down=this.right;
		this.right=oup;
	}
	
	//更新翻转后的数据
	this.updFlip = function(){
		var oltx=this.ltx;
		var olty=this.lty;
		var ortx=this.rtx;
		var orty=this.rty;
		this.ltx=this.lbx;
		this.lty=this.lby;
		this.rtx=this.rbx;
		this.rty=this.rby;
		this.lbx=oltx;
		this.lby=olty;
		this.rbx=ortx;
		this.rby=orty;
		this.brick.updFlip();
		
		var oup=this.up;//原来的上方方格
		this.up=this.down;
		this.down=oup;
	}

	//将砖块放到正确的位置（间隙）
	this.fitBrick = function(padding){
		this.brick.ltx=this.ltx+padding;
		this.brick.lty=this.lty+padding;
		this.brick.rtx=this.rtx-padding;
		this.brick.rty=this.rty+padding;
		this.brick.rbx=this.rbx-padding;
		this.brick.rby=this.rby-padding;
		this.brick.lbx=this.lbx+padding;
		this.brick.lby=this.lby-padding;
	}
}

//沙盒类（cxt，分数板element，计步器element，ID，列数，行数，方格半径，canvas宽度，canvas高度）
function Table(cxt,scrbrd,stpbrd,id,w,h,r,canvasW,canvasH)
{
	//--------常量--------
	this.cxt = 0;
	this.scrbrd = 0;
	this.stpbrd = 0;
	this.id = 0;
	this.w = 0;
	this.h = 0;
	this.r = 0;
	this.canvasW = 100;
	this.canvasH = 100;
	//颜色数组
	this.colors = new Array("green","blue","red","grey"
							,"#E5DF02"//黄
							,"#15E6FE"//蓝
							,"#F993F2"//粉红
							,"black");
	this.degree = 5;//每帧旋转角度
	this.sglSco = 1;//消除单个砖块的分数
	this.combSco = 5;//连续消除的奖励分数
	this.scoreInterval = 30;//分数难度阶梯
	this.originNumColors = 3;//初始使用的颜色数量
	this.paddingRate = 20;//间隙宽度指数(0-99)
	this.animateSpeed = 22;//动画帧速度
	this.afallspeed = 0.4;//砖块下落加速度
	this.clearNum = 3;//可以消除的最小砖块数量
	this.maxAddNum = 0;//最大新增砖块数
	this.displayID = false;//显示方格ID
	this.padding = 5;//砖块间隙
	this.additionInterval = 3;//添加砖块的操作间隔数
	this.originScore = 0;//初始分数
	
	//--------变量--------
	this.playing = true;//游戏进行中
	this.x = 0;//左上角横坐标
	this.y = 0;//左上角纵坐标
	this.centX = 0;//中心点横坐标
	this.centY = 0;//中心点纵坐标
	this.up = 0;//沙盒上边缘
	this.down = 0;//沙盒下边缘
	this.score = this.originScore;//分数
	this.square1 = new Square();//左上角的方格
	this.square2 = new Square();//右上角的方格
	this.square3 = new Square();//右下角的方格
	this.square4 = new Square();//左下角的方格
	this.squares = new Array();//方格数组
	this.numcolors = this.originNumColors;//当前使用的颜色数量
	this.isStatic = false;//处于静止状态，按钮可用
	this.canStatic = true;//可以处于静止状态
	this.clearTime = 0;//每次旋转/翻转后执行消除动作的次数
	this.isAddingBrick = false;//正在添加砖块
	this.cInterval = 0;//当前操作数
	
	
	//--------函数--------
	//生成一个沙盒
	/*return-
		1:成功 |
		0: 缺少cxt |
	*/
	this.init = function(){
		if(cxt) this.cxt = cxt;
		else return 0;
		if(scrbrd) this.scrbrd = scrbrd;
		if(stpbrd) this.stpbrd = stpbrd;
		if(id) this.id=id;
		if(w){
			this.w = w;
		}
		if(h){
			this.h = h;
			this.y = 10;
		}
		if(w&h){
			this.maxAddNum = parseInt((this.w+this.h)/2);
		}
		if(r){
			this.r = r;
			this.padding = parseInt(r*this.paddingRate/100);//砖块间隙
			this.afallspeed = r/40;//砖块下落加速度
		}
		if(canvasW) this.canvasW = canvasW;
		if(canvasH) this.canvasH = canvasH;
		if(this.colors.length<=0){
			this.colors[0]="green";
			this.colors[1]="blue";
			this.colors[2]="red";
		}
		var res = 1;
		var idx = 1;//Square的ID指针
		this.x = parseInt(canvasW/2)-parseInt(this.w*this.r);//左上角横坐标
		this.y = parseInt(canvasW/2)-parseInt(this.h*this.r);//左上角纵坐标
		//添加方格
		for(var i=0;i<this.h;i++){
			for(var j=0;j<this.w;j++){
				var s = new Square(idx,this.x+this.r+j*this.r*2,this.y+this.r+i*this.r*2,this.r);
				s.brick = new Brick(s.x,s.y,s.r-this.padding);
				if(getRandom(0,10)>7){//随机添加方块
					s.empty=false;
					s.brick.color=this.colors[getRandom(0,this.originNumColors)];
				}
				this.squares.push(s);
				idx++;
			}
		}
		//设置每个方格的邻格
		for(var i=0;i<this.squares.length;i++){
			var s = this.squares[i];
			if(i%this.w>0){//不是第一列
				s.left = this.squares[i-1].id;//s的左方的格子为s-1
				this.squares[i-1].right = s.id;//s-1的右方的格子为s
			}
			if(i>=this.w){//不是第一行
				s.up = this.squares[i-this.w].id;//s的上方的格子为s-w
				this.squares[i-this.w].down = s.id;//s-w的下方的格子为s
			}
		}
		this.square1 = this.squares[0];//左上角方格
		this.square2 = this.squares[this.w-1];//右上角方格
		this.square3 = this.squares[this.squares.length-1];//右下角方格
		this.square4 = this.squares[this.squares.length-1-(this.w-1)];//左下角方格
		this.centX = (this.square1.x+this.square3.x)/2;//中心点横坐标
		this.centY = (this.square1.y+this.square3.y)/2;//中心点纵坐标
		this.up = this.squares[0].lty;//沙盒上边缘
		this.down = this.squares[this.squares.length-1].lby;//沙盒下边缘
		return res;
	}
	
	//绘制一个沙盒
	this.draw = function(){
		this.cxt.clearRect(0,0,this.canvasW,this.canvasH);
		for(var i=0;i<this.squares.length;i++){
			this.drawSquare(this.squares[i],this.padding);
		}
		//画沙盒边框
		this.cxt.strokeStyle = "#000";
		this.cxt.lineWidth = 3;
		this.cxt.beginPath();
		this.cxt.moveTo(this.square1.ltx,this.square1.lty);
		this.cxt.lineTo(this.square2.rtx,this.square2.rty);
		this.cxt.lineTo(this.square3.rbx,this.square3.rby);
		this.cxt.lineTo(this.square4.lbx,this.square4.lby);
		this.cxt.lineTo(this.square1.ltx,this.square1.lty);
		this.cxt.stroke();
		this.cxt.closePath();
	}
	
	//画方格（Square）
	this.drawSquare = function(square){
		var id = square.id;
		var empty = square.empty;
		var color = square.brick.color;
		
		
		//画方格边
		this.cxt.strokeStyle = "#CCC";
		this.cxt.lineWidth = 1;
		this.cxt.beginPath();
		this.cxt.moveTo(square.ltx,square.lty);
		this.cxt.lineTo(square.rtx,square.rty);
		this.cxt.lineTo(square.rbx,square.rby);
		this.cxt.lineTo(square.lbx,square.lby);
		this.cxt.lineTo(square.ltx,square.lty);
		this.cxt.stroke();
		this.cxt.closePath();
		
		//画砖块
		if(!empty){
			this.cxt.strokeStyle = color;
			this.cxt.fillStyle = color;
			
			this.cxt.beginPath();
			this.cxt.moveTo(square.brick.ltx,square.brick.lty);
			this.cxt.lineTo(square.brick.rtx,square.brick.rty);
			this.cxt.lineTo(square.brick.rbx,square.brick.rby);
			this.cxt.lineTo(square.brick.lbx,square.brick.lby);
			this.cxt.lineTo(square.brick.ltx,square.brick.lty);
			this.cxt.stroke();
			
			this.cxt.fill();
		}
		//写编号
		if(this.displayID){
			this.cxt.lineWidth=1;this.cxt.strokeStyle="black";this.cxt.strokeText(square.brick.ltx,square.ltx+this.r-5,square.lty+this.r+5);
		}
		//显示加分
		if(square.text.length>0){
			this.cxt.font=square.fontSize+"px Arial";
			this.cxt.strokeStyle="black";
			this.cxt.strokeText(square.text,square.ltx+this.r-5,square.lty+this.r+5);
		}
		
		this.cxt.closePath();
	}
	
	//根据ID返回方格（ID）
	this.getSquareByID = function(id){
		var res = new Square();
		for(var i=0;i<this.squares.length;i++){
			if(this.squares[i].id==id){
				res = this.squares[i];
				break;
			}
		}
		return res;
	}
	
	//获得两点的距离（x1，y1，x2，y2）
	this.getDistance = function(x1,y1,x2,y2){
		return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
	}
	
	//旋转（角度：正数为左旋转，负数为右旋转）
	this.turn = function(deg){
		if(this.isStatic&&this.playing){
			this.isStatic = false;//沙盒动态
			var _this = this;
			var t = 0;//计时器
			var itv = setInterval(function(){//动画开始
				if(t>=Math.abs(deg)){
					clearInterval(itv);//停止动画
					if(deg>0) _this.updTurnLeft();
					else _this.updTurnRight();
					_this.brickControll();
				}
				else{
					for(var i=0;i<_this.squares.length;i++){//每个方格旋转this.degree角度
						_this.squares[i].rotate(_this.centX,_this.centY,deg>0?_this.degree:-_this.degree);
					}
					_this.draw();//绘制沙盒
				}
				t+=_this.degree;
			},this.animateSpeed)
		}
	}
	
	//上下翻转（速度:1-100，必须能被100整除）
	this.flip = function(speed){
		if(this.isStatic&&100%speed==0&&this.playing){
			this.isStatic = false;//沙盒动态
			var _this = this;
			for(var i=0;i<this.squares.length;i++){
				this.squares[i].tstep = (this.centY-this.squares[i].lty)*2/parseInt(100/speed);//方格上边界的位移长度
				this.squares[i].bstep = (this.centY-this.squares[i].lby)*2/parseInt(100/speed);//方格下边界的位移长度
				this.squares[i].brick.tstep = (this.centY-this.squares[i].brick.lty)*2/parseInt(100/speed);//砖块上边界的位移长度
				this.squares[i].brick.bstep = (this.centY-this.squares[i].brick.lby)*2/parseInt(100/speed);//砖块下边界的位移长度
			}
			var t = 0;//计时器
			var itv = setInterval(function(){//动画开始
				if(t>=100){
					clearInterval(itv);//停止动画
					_this.updFlip();
					_this.brickControll();
				}
				else{
					for(var i=0;i<_this.squares.length;i++){
						_this.squares[i].shift();//位移
					}
					_this.draw();//绘制沙盒
				}
				t+=speed;
			},this.animateSpeed)
		}
	}
	
	//更新向左旋转后的数据
	this.updTurnLeft = function(){
		for(var i=0;i<this.squares.length;i++){
			this.squares[i].updTurnLeft();
		}
		var osquare1=this.square1;
		var originw=this.w;
		this.square1=this.square2;
		this.square2=this.square3;
		this.square3=this.square4;
		this.square4=osquare1;
		this.w=this.h;
		this.h=originw;
	}
	
	//更新向右旋转后的数据
	this.updTurnRight = function(){
		for(var i=0;i<this.squares.length;i++){
			this.squares[i].updTurnRight();
		}
		var osquare3=this.square3;
		var originw=this.w;
		this.square3=this.square2;
		this.square2=this.square1;
		this.square1=this.square4;
		this.square4=osquare3;
		this.w=this.h;
		this.h=originw;
	}
	
	//更新翻转后的数据
	this.updFlip = function(){
		for(var i=0;i<this.squares.length;i++){
			this.squares[i].updFlip();
		}
		var osquare1=this.square1;
		var osquare2=this.square2;
		this.square1=this.square4;
		this.square4=osquare1;
		this.square2=this.square3;
		this.square3=osquare2;
	}

	//整理砖块
	this.brickControll = function(){
		var ptr = this.square4.id;//方格ID指针（int）
		var canMoveUp = true;//指针可以向上移动
		var _this = this;
		var osquares = new Array();//可以坠落的砖块方格数组
		var fallsquares = new Array();//坠落后的砖块所在方格数组
		var fallspeed = 0;//下落速度
		var numStaticBrick = 0;//已经稳定的砖块数
		
		//从底部向上，执行每一行
		do{
			var optr = ptr;//本行第一个方格
			var canMoveRight = true;//指针可以向右移动
			//从第一个方格向右，执行每个方格
			do{
				var s=this.getSquareByID(ptr);
				if(!s.empty){
					var fall = this.fall(s.id);
					if(fall.pass>0){
						var b = this.getSquareByID(fall.bottom);//坠落后砖块所在的方格
						b.brick=s.brick.copy();
						b.brick.isStatic = false;
						//添加方格到指定数组
						osquares.push(s);
						fallsquares.push(b);
						b.empty=false;
						//s.brick=new Brick();
						s.empty=true;
						s.brick.falling=true;
					}
				}
				if(s.right!=0){
					ptr = s.right;//指向右边一个方格
				}
				else{
					canMoveRight = false;
				}
			}
			while(canMoveRight);
			if(this.getSquareByID(ptr).up!=0){
				ptr = this.getSquareByID(optr).up;//指向上方行的第一个方格
			}
			else{
				canMoveUp = false;
			}
		}
		while(canMoveUp);
		for(var i=0;i<osquares.length;i++){
			osquares[i].brick.falling=false;
		}
		//显示坠落动画
		var itv = setInterval(function(){//动画开始
			for(var i=0;i<fallsquares.length;i++){
				var s = fallsquares[i];
				var b = s.brick;
				if(b.rby>=s.rby-_this.padding){//如果该方格的砖块已经稳定
					b.lty = s.lty+_this.padding;
					b.rty = s.rty+_this.padding;
					b.rby = s.rby-_this.padding;
					b.lby = s.lby-_this.padding;
					if(!b.isStatic){
						b.isStatic = true;
						numStaticBrick += 1;
					}
				}
				else{//砖块下坠
					b.lty+=fallspeed;
					b.rty+=fallspeed;
					b.rby+=fallspeed;
					b.lby+=fallspeed;
				}
				
			}
			if(numStaticBrick>=fallsquares.length){//如果所有砖块都已稳定
				clearInterval(itv);
				for(var i=0;i<fallsquares.length;i++){
					fallsquares[i].fitBrick(_this.padding);//把砖块移到b方格的位置
				}
				_this.clearBricks();//消除砖块
			}
			fallspeed+=_this.afallspeed;
			_this.draw();
		},this.animateSpeed)
	}
	
	//获得[方格的坠落空间数，底部方格ID]（砖块所在方格ID，初始历经格子数=0）
	this.fall = function(sid,pass){
		if(!pass) pass=0;
		var s = this.getSquareByID(sid);
		if(s.down==0||(!this.getSquareByID(s.down).empty&&!this.getSquareByID(s.down).brick.falling)){//如果不能继续下落
			return {pass:pass,bottom:sid};
		}
		else{
			return this.fall(s.down,pass+1);
		}
	}

	//消除砖块
	this.clearBricks = function(){
		var removal = new Array();//可以移除的砖块所在方格ID的数组（int）
		//扫描横排
		var ptr = this.square4.id;//方格ID指针（int）
		var canMoveUp = true;//指针可以向上移动
		//从底部向上，执行每一行
		do{
			var optr = ptr;//本行第一个格子ID
			var canMoveRight = true;//指针可以向右移动
			var cid = 0;//当前进行对比的格子ID
			var c_num = 1;//当前颜色c_color对应的连续格子数
			//从第一个方格向右，执行每个方格
			do{
				var s = this.getSquareByID(ptr);
				
				if(!s.empty){
					var c = this.getSquareByID(cid);
					if(s.brick.color!=c.brick.color){
						cid = s.id;
						c = s;
						c_num = 1;
					}
					else{
						c_num ++;
						if(c_num==this.clearNum){//如果连续格子数等于可以消除的数量
							var cidptr = cid;//从cid开始的指针
							for(var i=0;i<this.clearNum;i++){
								removal.push(cidptr);
								cidptr = this.getSquareByID(cidptr).right;//cidptr指向它的右方格
							}
						}
						else if(c_num>this.clearNum){//如果连续格子数大于可以消除的数量
							removal.push(ptr);
						}
					}
				}
				else{
					cid = 0;
					c_num = 1;
				}
				
				if(s.right!=0) ptr = s.right;//指向右边一个方格
				else canMoveRight = false;
			}
			while(canMoveRight);
			if(this.getSquareByID(ptr).up!=0) ptr = this.getSquareByID(optr).up;//指向上方行的第一个方格
			else canMoveUp = false;
		}
		while(canMoveUp);
		
		//扫描竖排
		ptr = this.square2.id;//方格ID指针（int）
		var canMoveLeft = true;//指针可以向左移动
		//从右列向左，执行每一列
		do{
			var optr = ptr;//本列第一个格子ID
			var canMoveDown = true;//指针可以向下移动
			var cid = 0;//当前进行对比的格子ID
			var c_num = 1;//当前颜色c_color对应的连续格子数
			//从第一个方格向下，执行每个方格
			do{
				var s = this.getSquareByID(ptr);
				
				if(!s.empty){
					var c = this.getSquareByID(cid);
					if(s.brick.color!=c.brick.color){
						cid = s.id;
						c = s;
						c_num = 1;
					}
					else{
						c_num ++;
						if(c_num==this.clearNum){//如果连续格子数等于可以消除的数量
							var cidptr = cid;//从cid开始的指针
							for(var i=0;i<this.clearNum;i++){
								removal.push(cidptr);
								cidptr = this.getSquareByID(cidptr).down;//cidptr指向它的下方格
							}
						}
						else if(c_num>this.clearNum){//如果连续格子数大于可以消除的数量
							removal.push(ptr);
						}
					}
				}
				else{
					cid = 0;
					c_num = 1;
				}
				
				if(s.down!=0) ptr = s.down;//指向下边一个方格
				else canMoveDown = false;
			}
			while(canMoveDown);
			if(this.getSquareByID(ptr).left!=0) ptr = this.getSquareByID(optr).left;//指向左方列的第一个方格
			else canMoveLeft = false;
		}
		while(canMoveLeft);
		
		if(removal.length>0){//如果有砖块可以消除
			var shrick = this.r/10;//缩放值
			var t = 0;//消除动画计时器
			var t2 = 0;//分数动画计时器
			this.clearTime ++;//本次旋转的消除次数+1
			var _this = this;
			
			//设置获得的分数
			for(var i=0;i<removal.length;i++){
				var b = _this.getSquareByID(removal[i]);
				b.text = "+"+this.sglSco;
				b.fontSize = 12;
			}
			this.score += removal.length*this.sglSco;
			var itv = setInterval(function(){//消除动画
				for(var i=0;i<removal.length;i++){
					var s = _this.getSquareByID(removal[i]);
					var b = s.brick;
					if(b.ltx<b.rbx&&b.lty<b.rby){
						b.ltx += shrick;b.lty += shrick;
						b.rtx -= shrick;b.rty += shrick;
						b.rbx -= shrick;b.rby -= shrick;
						b.lbx += shrick;b.lby -= shrick;
					}
				}
				if(t>5){
					clearInterval(itv);
					for(var i=0;i<removal.length;i++){
						var s = _this.getSquareByID(removal[i]);
						s.empty = true;
						s.fitBrick(_this.padding);
					}
					_this.brickControll();
				}
				t++;
				_this.draw();
			},this.animateSpeed)
			var scoitv = setInterval(function(){//分数动画
				for(var i=0;i<removal.length;i++){
					var s = _this.getSquareByID(removal[i]);
					if(s.fontSize<35){
						s.fontSize++;
					}
				}
				if(t2>=30){
					clearInterval(scoitv);
					for(var i=0;i<removal.length;i++){
						var s = _this.getSquareByID(removal[i]);
						s.fontSize=12;
						s.text="";
						
					}
				}
				t2++;
				_this.draw();
			},this.animateSpeed)
		}
		else{
			if(this.clearTime==0&&this.cInterval==this.additionInterval){//如果消除砖块的次数为 0 
				this.cInterval=0;
				if(!this.isAddingBrick){
					var addnum = this.clearNum + parseInt(this.score/this.scoreInterval);//添加的砖块数量
					if(addnum>this.maxAddNum){
						addnum=this.maxAddNum;
					}
					if(addnum==this.maxAddNum){
						this.numcolors=this.originNumColors+parseInt(this.score/(this.scoreInterval*2))+this.clearNum-this.maxAddNum;
						if(this.numcolors>this.colors.length){
							this.numcolors=this.colors.length;
						}
						if(this.numcolors<this.originNumColors){
							this.numcolors=this.originNumColors;
						}
					}
					this.isAddingBrick=true;
					this.addBricks(addnum);
					this.brickControll();
					this.canStatic =false;
				}
				else{
					this.isAddingBrick=false;
					this.canStatic=true;
				}
			}
			else{//结束本次操作
				if(this.clearTime==0){
					this.cInterval ++;
				}
				else{
					this.cInterval=1;
				}
				this.isAddingBrick=false;
				this.canStatic=true;
				var numbricks = this.getNumBricks();
				if(numbricks>=this.squares.length){//如果砖块满了，结束游戏
					this.playing=false;
					this.canStatic=false;
					this.isStatic=true;
					this.gameover();
				}
			}
			this.clearTime=0;
			if(this.canStatic){
				this.isStatic=true;
				this.showScore();
			}
		}
		
	}
	
	//添加砖块（添加的数量）
	this.addBricks = function(num){
		var emptySquares = new Array();//可添加砖块的方格ID的数组（int）
		var addedSquares = new Array();//已经添加好的方格ID的数组（int）
		var ptr = this.square1.id;//方格指针（只扫描第一行）
		var canMoveRight = true;//指针可以向右移动
		do{
			var s = this.getSquareByID(ptr);
			if(s.empty){
				emptySquares.push(s.id);
			}
			if(s.right!=0) ptr = s.right;
			else canMoveRight = false;
		}while(canMoveRight)
		
		//emptySquares已获得
		//随机添加num个砖块到emptySquares
		for(var i=0;i<num;i++){//添加 num 个方格
			if(i<emptySquares.length){//把要添加的砖块添加到第一行的空方格中
				var s = this.getSquareByID(emptySquares[getRandom(0,emptySquares.length)]);//随机获取可以添加砖块的方格
				while(!s.empty){//如果该方格已有砖块，重新获取，直到找到空的方格
					s = this.getSquareByID(emptySquares[getRandom(0,emptySquares.length)]);
				}
				s.empty = false;
				s.brick.color = this.colors[getRandom(0,this.numcolors)];
				addedSquares.push(s.id);
			}
			else{//如果第一行的方格满了
				for(var j=0;j<num-addedSquares.length;j++){//扫描第一行中已添加好的方格
					var ptr = addedSquares[j];//方格指针（扫描一列）
					var canMoveDown = true;//指针可以向下移动
					do{
						var s = this.getSquareByID(ptr);
						if(s.empty){
							s.empty = false;
							s.brick.color = this.colors[getRandom(0,this.numcolors)];
							canMoveDown = false;
							break;
						}
						if(s.down!=0&&canMoveDown) ptr = s.down;
						else canMoveDown = false;
					}while(canMoveDown);
				}
			}
		}
		//alert(addedSquares.length);//@TEST
	}
	
	//显示更新分数
	this.showScore = function(){
		this.scrbrd.text("分数：");
		this.scrbrd.append(this.score);
		this.stpbrd.text("下一次新增方块将在：");
		this.stpbrd.append((this.additionInterval-this.cInterval+1)+" 步之后");
	}

	//获得所有砖块的数量
	this.getNumBricks = function(){
		var res = 0;
		for(var i=0;i<this.squares.length;i++){
			if(!this.squares[i].empty) res ++;
		}
		return res;
	}

	//结束游戏
	this.gameover = function(){
		this.stpbrd.hide();
		$("#TL").hide();
		$("#FL").hide();
		$("#TR").hide();
		$("#restart").show();
		alert("游戏结束\n你的分数为： "+this.score+" !");
	}

}

//获得随机整数（最小值，最大值）
function getRandom(min,max){
	var res = 0;
	res = parseInt((Math.random()*max))+min;
	return res;
}

//获得sin（度数）
function sin(deg){
	return Math.sin(deg*Math.PI/180);
}

//获得cos（度数）
function cos(deg){
	return Math.cos(deg*Math.PI/180);
}

//围绕A点旋转到B点获得新的B点的坐标集合[x,y]（A点x，A点y，B点x，B点y，旋转角度，AB距离（可选））
function rotate(centX,centY,x,y,deg,dis){
	if(dis==undefined){
		var dis = Math.sqrt(Math.pow(x-centX,2)+Math.pow(y-centY,2));
	}
	if(dis==0){
		return {x:x,y:y};
	}
	var cosA = (x-centX)/dis;
	var sinA = (centY-y)/dis;
	var cosB = cos(deg);
	var sinB = sin(deg);
	var cosC = cosA*cosB-sinA*sinB;
	var sinC = sinA*cosB+sinB*cosA;
	return {x:cosC*dis+centX,y:centY-sinC*dis};
}












