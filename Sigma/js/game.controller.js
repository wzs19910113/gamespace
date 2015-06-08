/*
*  ------------------------
*  --------全局参数--------
*  ------------------------
*/

if(typeof TIME_LIMIT =='undefined') TIME_LIMIT = 60;//限定游戏时间（秒）
if(typeof TIME_BONUS =='undefined') TIME_BONUS = 10;//奖励时间
if(typeof SCORE_INIT =='undefined') SCORE_INIT = 0;//初始游戏分数
if(typeof SCORE_PUNISH_PUSH =='undefined') SCORE_PUNISH_PUSH = 10;//数字按钮复位的分数惩罚值
if(typeof SCORE_PUNISH_REFRESH =='undefined') SCORE_PUNISH_REFRESH = 50;//刷新数字表的分数惩罚值

if(typeof COOL_DOWN_1 =='undefined') COOL_DOWN_1 = 60;//刷新数字表的冷却时间（秒）

if(typeof BACKGROUND_COLOR =='undefined') BACKGROUND_COLOR = "rgb(242,242,242)";//背景颜色

if(typeof DIGITBUTTON_MAX_TEXT =='undefined') DIGITBUTTON_MAX_TEXT = 99;//·数字按钮的最大值
if(typeof DIGITBUTTON_PANEL_ROW =='undefined') DIGITBUTTON_PANEL_ROW = 5;//·数字表的行数
if(typeof DIGITBUTTON_PANEL_COLUMN =='undefined') DIGITBUTTON_PANEL_COLUMN = 5;//·数字表的列数
if(typeof DIGITBUTTON_SIZE =='undefined') DIGITBUTTON_SIZE = 155;//·数字表中数字按钮的尺寸（即边长长度）（px）
if(typeof EQUALBUTTON_SIZE =='undefined') EQUALBUTTON_SIZE = 155;//·等于按钮的尺寸（即边长长度）（px）
if(typeof DIGITBUTTON_MARGIN =='undefined') DIGITBUTTON_MARGIN = 25;//·数字表中数字按钮的间距（px）
if(typeof DIGITBUTTON_UP_IMG =='undefined') DIGITBUTTON_UP_IMG = "img/up.png";//·数字按钮凸起时的图像地址
if(typeof DIGITBUTTON_DOWN_IMG =='undefined') DIGITBUTTON_DOWN_IMG = "img/down.png";//·数字按钮凹陷时的图像地址
if(typeof DIGITBUTTON_FONT =='undefined') DIGITBUTTON_FONT = "bold 100px Microsoft YaHei";//·数字按钮的字体）
if(typeof DIGITBUTTON_DOWN_TEXTCOLOR =='undefined') DIGITBUTTON_DOWN_TEXTCOLOR = "rgb(100,100,242)";//数字按钮按下后的文本颜色
if(typeof DIGITBUTTON_ANIMATE_SPEED =='undefined') DIGITBUTTON_ANIMATE_SPEED = 50;//数字按钮动画的速度（毫秒）
if(typeof DIGITBUTTON_ANIMATE_FRAME =='undefined') DIGITBUTTON_ANIMATE_FRAME = 2;//数字按钮动画的帧数

if(typeof THEME_R =='undefined') THEME_R = 24;///初始主题颜色的红色值（0-255）
if(typeof THEME_G =='undefined') THEME_G = 155;///初始主题颜色的绿色值（0-255）
if(typeof THEME_B =='undefined') THEME_B = 24;///初始主题颜色的蓝色值（0-255）
if(typeof THEME_R_LIMIT =='undefined') THEME_R_LIMIT = 220;//主题颜色的红色最大值（THEME_R-255）
if(typeof THEME_FRAQUENCY =='undefined') THEME_FRAQUENCY = 1000;//主题颜色变化的频率（毫秒）
if(typeof THEME_ALARM_EXPONENT =='undefined') THEME_ALARM_EXPONENT = 3;//主题颜色变化速率的指数（数值越大颜色变化速率越大）

if(typeof LANG_1 =='undefined') LANG_1 = "欢迎进入Sigma!";//文本 ：欢迎进入Sigma!
if(typeof LANG_2 =='undefined') LANG_2 = "游戏结束";//文本 ：游戏结束
if(typeof LANG_3 =='undefined') LANG_3 = "你的分数：";//文本 ：你的分数：
if(typeof LANG_4 =='undefined') LANG_4 = "你的最高分：";//文本 ：你的最高分：
if(typeof LANG_5 =='undefined') LANG_5 = "打破纪录：";//文本 : 打破纪录：
if(typeof LANG_6 =='undefined') LANG_6 = "点击任意处开始游戏";//文本 ：点击任意处开始游戏

/*
*  ------------------------
*  -----------类-----------
*  ------------------------
*/

/*	事件处理器
*	@param C : canvas 标签
*	@param ctx : canvas 画板
*	@param restart : r重新开始按钮
*	@param timebar : 时间栏标签
*	@param scorebar : 分数栏标签
*/
function EventHandler( C, ctx, restart, timebar, scorebar ){

	//--------变量--------

	this.horiPxlAmt;//画板横向像素数
	this.vertiPxlAmt;//画板纵向像素数
	this.ctxWidth;//画板宽度
	this.ctxHeight;//画板高度
	this.ctxLeft;//画板左边横坐标
	this.ctxTop;//画板上边纵坐标
	this.painter;
	this.map;
	this.bg1id;//上层背景图元件的 ID
	this.bg2id;//下层背景图元件的 ID
	this.time = TIME_LIMIT;//时间
	this.clock = 0;//计时器
	this.timebardesc = "时间";//时间栏的固有文本
	this.scorebardesc = "分数";//时间栏的固有文本
	this.theme_r = THEME_R;//主题颜色变量的红色值
	this.theme_g = THEME_G;//主题颜色变量的红色值
	this.theme_b = THEME_B;//主题颜色变量的红色值
	this.infoText;// 信息提示文本
	this.equalButton;//等号按钮
	this.refreshButton;//跟换按钮
	this.factorText;//因子文本
	this.sumText;//和文本
	this.sum = 0;//和
	this.record;//分数记录
	this.playing = false;//正在游戏中
	this.canRefresh = false;//可以刷新
	this.cd1 = 0;//刷新冷却时间

	if(C) this.C = C;
	if(ctx) this.ctx = ctx;
	if(restart) this.restart = restart;
	if(timebar){
		this.timebar = timebar;
		this.timebardesc = this.timebar.text();
	}
	if(scorebar){
		this.scorebar = scorebar;
		this.scorebardesc = this.scorebar.text();
	}

	//--------函数--------

	//初始化 : 当用户 图像加载完成 后执行..
	this.init = function(){
		if(this.C&&this.ctx){

			var _this = this;
			
			//----设置画板参数----
			//获取画板像素
			this.horiPxlAmt = this.C.attr("width").replace(/[A-z]/g,"");
			this.vertiPxlAmt = this.C.attr("height").replace(/[A-z]/g,"");
			//自适应画面
			this.ctxWidth = Math.round(this.C.css("width").replace(/[A-z]/g,""));
			this.ctxHeight = Math.round(this.ctxWidth*this.vertiPxlAmt/this.horiPxlAmt);

			//alert(this.ctxWidth+"\n"+this.ctxHeight+"\n------\n"+window.innerWidth+"\n"+window.innerHeight);
			//alert(this.ctxHeight-window.innerHeight);
			//alert((DIGITBUTTON_MARGIN*2+DIGITBUTTON_SIZE)/this.horiPxlAmt*this.ctxHeight);
			if((this.ctxHeight-window.innerHeight)>(DIGITBUTTON_MARGIN*2+DIGITBUTTON_SIZE)/this.horiPxlAmt*this.ctxHeight){
				this.ctxHeight = (DIGITBUTTON_MARGIN*2+DIGITBUTTON_SIZE)/this.horiPxlAmt*this.ctxHeight+window.innerHeight;
			}

			this.C.css("width",this.ctxWidth);
			this.C.css("height",this.ctxHeight);
			//获取画板边坐标 
			this.ctxLeft = Math.round(this.C.offset().left);
			this.ctxTop = Math.round(this.C.offset().top);

			this.map = new ComponentChain();

			//设置 painter
			this.painter = new Painter(this.ctx,this.horiPxlAmt,this.vertiPxlAmt,this.map);

			//----绑定触控事件----

			this.C.on("tap",function(e){
				_this.tap(e);
			});
			this.C.on("taphold",function(e){
				_this.taphold(e);
			});
			this.C.on("vmousedown",function(e){
				_this.touchdown(e);
			});
			this.C.on("vmouseup",function(e){
				_this.touchup(e);
			});
			this.C.on("vmousemove",function(e){
				_this.touchmove(e);
			});
			this.restart.on("tap",function(e){
				_this.playing = false;
				_this.infoText.display = true;
				_this.reset();
				_this.restart.css("display","none");
			});

			//----设置主题----

			var BG1 = new Background("#DDD");
			BG1.w=this.horiPxlAmt;
			BG1.h=DIGITBUTTON_SIZE*DIGITBUTTON_PANEL_ROW+DIGITBUTTON_MARGIN*(DIGITBUTTON_PANEL_ROW-1)+DIGITBUTTON_SIZE+DIGITBUTTON_MARGIN;
			BG1.x=BG1.w/2;BG1.y=BG1.h/2;
			BG1.z=-1;

			var BG2 = new Background(this.theme_color);
			BG2.w=this.horiPxlAmt;
			BG2.h=this.vertiPxlAmt;
			BG2.x=BG2.w/2;BG2.y=BG2.h/2;
			BG2.z=-2;

			this.bg1id = this.map.addComponent(BG1);
			this.bg2id = this.map.addComponent(BG2);

			this.setTheme(this.getTheme());

			//隐藏 重新开始 按钮
			this.restart.css("display","none");

			//设置默认的开始按钮
			var info = new Text(LANG_1);
			info.x = this.horiPxlAmt/2; info.y = this.vertiPxlAmt/3;
			info.w = this.veriPxlAmt/5; info.h = this.horiPxlAmt/7; 
			info.z = 3;

			this.infoText = info;
			this.infoText.text2 = LANG_6;
			this.map.addComponent(this.infoText);

			//----绘图----
			this.painter.paint();

			return true;
		}
		else{
			return false;
		}
	}

	//游戏开始 : 当用户点击 开始游戏 后执行
	this.start = function(){
		var _this = this;
		this.playing = true;
		this.infoText.display = false;
		this.setTime(TIME_LIMIT*1000);
		this.setScore(SCORE_INIT);
		this.record = $.cookie("maxScore");

		//----初始化底端-----
		var baseVertical = Math.round((DIGITBUTTON_SIZE+2*DIGITBUTTON_MARGIN)*(DIGITBUTTON_PANEL_ROW+0.8));
		this.factorText = new Text("?");
		this.factorText.x = Math.round(this.horiPxlAmt/16*2); this.factorText.y = baseVertical;
		this.sumText = new Text("?");
		this.sumText.x = Math.round(this.horiPxlAmt/16*10); this.sumText.y = baseVertical;
		this.equalButton = new Button(1,DIGITBUTTON_UP_IMG,DIGITBUTTON_FONT,DIGITBUTTON_DOWN_IMG);
		this.equalButton.x = Math.round(this.horiPxlAmt/16*6); this.equalButton.y = baseVertical;
		this.equalButton.setSize(EQUALBUTTON_SIZE);
		this.equalButton.text = "=";
		this.refreshButton = new Button(2,DIGITBUTTON_UP_IMG,DIGITBUTTON_FONT,DIGITBUTTON_DOWN_IMG);
		this.refreshButton.x = DIGITBUTTON_PANEL_COLUMN*(DIGITBUTTON_SIZE+DIGITBUTTON_MARGIN);
		this.refreshButton.y = baseVertical;
		this.refreshButton.setSize(DIGITBUTTON_SIZE);
		this.refreshButton.text = "R";

		//----重置数据----
		this.reset();

		//----初始化数字表----
		var i=0,j=0;
		for(;i<DIGITBUTTON_PANEL_ROW;i++){
			for(j=0;j<DIGITBUTTON_PANEL_COLUMN;j++){
				var B = new Button(0,DIGITBUTTON_UP_IMG,DIGITBUTTON_FONT,DIGITBUTTON_DOWN_IMG);
				B.setSize(DIGITBUTTON_SIZE);
				B.x = (j%DIGITBUTTON_PANEL_COLUMN+1)*(DIGITBUTTON_SIZE+DIGITBUTTON_MARGIN);
				B.y = (i%DIGITBUTTON_PANEL_ROW+1)*(DIGITBUTTON_SIZE+DIGITBUTTON_MARGIN);
				B.setText(parseInt(Math.random()*(DIGITBUTTON_MAX_TEXT)+1));
				while(this.mapHasButtonWithText(B.text)){//确保没有重复的 text 
					B.setText(parseInt(Math.random()*(DIGITBUTTON_MAX_TEXT)+1));
				}
				this.map.addComponent(B);
			}
		}

		this.map.addComponent(this.factorText);
		this.map.addComponent(this.sumText);
		this.map.addComponent(this.equalButton);
		this.map.addComponent(this.refreshButton);

		//显示 重新开始 按钮
		this.restart.css("display","inline");

		this.canRefresh = true;//允许刷新

		//----绘图----
		this.painter.paint();

		//----设置计时器----
		this.clock = setInterval(function(){
			_this.setTime(_this.time-THEME_FRAQUENCY);
			_this.painter.paint();
			if(_this.cd1>1){//刷新冷却中
				_this.cd1--;
				_this.refreshButton.setText(_this.cd1);
			}
			else if(_this.cd1==1){//刷新冷却完毕
				_this.refreshButton.setText("R");
				_this.refreshButton.unforbid();
				_this.refreshButton.up();
				_this.cd1 = 0;
			}

			if(_this.time<=0){
				clearInterval(_this.clock);
				_this.end();
			}
		},THEME_FRAQUENCY);
	}

	//游戏结束 
	this.end = function(){
		var _this = this;
		this.infoText.text = LANG_2;
		this.infoText.text2 = LANG_3+this.score;
		//保存cookie
		if($.cookie("maxScore")!==null){
			if(this.score<=this.record){
				this.infoText.text3 = LANG_4+$.cookie("maxScore");
			}
			else{
				this.infoText.text3 = LANG_5+$.cookie("maxScore")+"!";
				$.cookie("maxScore",this.score);
			}
		}
		else{
			$.cookie("maxScore",this.score);
		}
		this.record = $.cookie("maxScore");

		this.infoText.display = true;
		this.map.traverse(function(cpt){//禁用数字按钮
			if(cpt.id!=_this.bg1id&&cpt.id!=_this.bg2id&&cpt.id!=_this.infoText.id){
				if(cpt instanceof Button) cpt.forbid(0.05);
			}
		});
		this.factorText.display = this.refreshButton.display
		 = this.sumText.display = this.equalButton.display = false;

		this.painter.paint();
	}

	//重置（只重置数据，不更新画面）
	this.reset = function(){
		var _this = this;
		this.infoText.text = LANG_1;
		this.infoText.text2 = LANG_6;
		this.infoText.text3 = undefined;
		this.cd1 = 0;
		//重置全部内容
		this.map.traverse(function(cpt){//清除数字按钮
			//如果不是背景1，不是背景2，且不是信息提示文本：
			if(cpt.id!=_this.bg1id&&cpt.id!=_this.bg2id&&cpt.id!=_this.infoText.id){
				_this.map.deleteComponent(cpt.id);
			}
		});
		this.factorText.display = this.sumText.display = this.equalButton.display = true;
		this.setTime(TIME_LIMIT*1000);
		this.setScore(SCORE_INIT);
		this.setSum(0);
		clearInterval(this.clock);
	}

	//设置时间（以 毫秒 为单位）
	//返回超出的时间秒数
	this.setTime = function(val){
		var res = val-TIME_LIMIT*1000;//现有时间-最大时间（毫秒）
		this.time = res<=0?val:TIME_LIMIT*1000;
		this.timebar.text(this.timebardesc+Math.round(this.time/1000)+"");
		//设置主题颜色
		var timeRate = Math.pow(1-this.time/TIME_LIMIT/1000,THEME_ALARM_EXPONENT);
		this.theme_r = Math.round(THEME_R+(THEME_R_LIMIT-THEME_R)*timeRate);
		this.theme_g = Math.round(THEME_G*(1-timeRate));
		this.theme_b = Math.round(THEME_B*(1-timeRate));
		this.setTheme(this.getTheme());
		return res>0?Math.floor(res/1000):0;
	}

	//设置分数
	this.setScore = function(val){
		this.score = val;
		this.scorebar.text(this.scorebardesc+Math.round(this.score)+(this.record?("("+this.record+")"):""));
	}

	//设置主题颜色
	this.setTheme = function(color){
		$("a").css("color",color);
		$('head').append("<style>.a:active{ color:"+color+"; }</style>");
		$('theme').css("color",color);
		$('.theme').css("background-color",color);
		var BG2 = this.map.getComponent(this.bg2id);
		BG2.color = color;
		this.painter.paint();
	}

	//获得主题颜色文本
	this.getTheme = function(){
		return "rgb("+this.theme_r+","+this.theme_g+","+this.theme_b+")";
	}

	//根据 ID 更换单个数字按钮
	this.changeDigitButton = function(id){
		var _this = this;
		var cpt = this.map.getComponent(id);

		if((cpt instanceof Button)&&(cpt.type===0)){
			var newText = parseInt(Math.random()*(DIGITBUTTON_MAX_TEXT)+1);
			while(this.mapHasButtonWithText(newText)){//确保没有重复的 text 
				newText = parseInt(Math.random()*(DIGITBUTTON_MAX_TEXT)+1);
			}
			this.canRefresh = false;
			cpt.animate("change",DIGITBUTTON_ANIMATE_SPEED,DIGITBUTTON_ANIMATE_FRAME,
					function(){
						_this.canRefresh = true;
						_this.painter.paint();
					},newText);
		}
	}

	//更换全部数字按钮
	this.changeAllDigitButton = function(){
		var _this = this;
		this.map.traverse(function(cpt){
			if((cpt instanceof Button)&&(cpt.type===0)) cpt.up();
			_this.changeDigitButton(cpt.id);
		});
	}

	//返回布尔值 : this.map 是否含有指定 text 值的 Button
	this.mapHasButtonWithText = function(text){
		var res = false;
		this.map.traverse(function(cpt){
			if((cpt instanceof Button)&&(cpt.isDigit())&&(cpt.nextText===text)){
				res = true;
				return;
			}
		});
		return res;
	}

	//设置和值
	this.setSum = function(val){
		this.sum = val;
		this.factorText.text = this.sum===0?"?":this.sum+"";
	}

	/*	当用户 tap 时执行..
	*	@param e : Event 事件
	*/
	this.tap = function( e ){
		if(!this.playing){
			this.start();
		}
		this.painter.paint();
	}

	/*	当用户 taphold 时执行..
	*	@param e : Event 事件
	*/
	this.taphold = function( e ){
		
	}

	/*	当用户 touch down 时执行..
	*	@param e : Event 事件
	*/
	this.touchdown = function( e ){
		var _this = this;
		var x = Math.round(((e.clientX-this.ctxLeft)/this.ctxWidth)*this.horiPxlAmt);
		var y = Math.round(((e.clientY-this.ctxTop)/this.ctxHeight)*this.vertiPxlAmt);
		var inButton;//被按下的按钮
		this.painter.traverse(function(cpt){
			if((cpt instanceof Button)&&(cpt.isIn(x,y))&&(!cpt.forbidden)){
				inButton = cpt;
			}
		});
		if(inButton){
			if(inButton.type!=2){
				var inButtonIsPressed = inButton.pressed;
				inButton.switchImage();
				if(inButton.type===0){//数字按钮
					if(!this.equalButton.pressed){//如果等于号没有被按下
						if(!inButton.pressed)this.setScore(this.score-SCORE_PUNISH_PUSH);//惩罚
						this.setSum(this.sum+inButton.text*(inButton.pressed?1:-1));
					}
					else{//如果等于号已被按下
						if(!inButtonIsPressed&&this.sum===inButton.text){//等式成立
							var bonus = this.setTime(this.time+(TIME_BONUS+Math.floor(this.sum/10))*1000);
							this.setScore(this.score+this.sum+bonus);
							this.sumText.animate("disappear",50,28,function(){
								_this.painter.paint();
							},"+"+this.sum+(bonus>0?(" +"+bonus):""));
							this.map.traverse(function(cpt){
								if(cpt.pressed){
									cpt.up();
									_this.changeDigitButton(cpt.id);
								}
							});
						}
						else{//等式不成立
							this.map.traverse(function(cpt){
								if((cpt instanceof Button)&&(cpt.pressed)){
									cpt.up();
									if(cpt.type===0)_this.setScore(_this.score-SCORE_PUNISH_PUSH);//惩罚
								}
							});
						}
						this.setSum(0);
					}
				}
			}
			else inButton.down();//功能按钮

			if(inButton.id===this.refreshButton.id&&this.canRefresh){//刷新按钮被按下
				if(!inButton.forbidden){
					this.setSum(0);
					this.setScore(this.score-SCORE_PUNISH_REFRESH);
					this.changeAllDigitButton();
					this.cd1 = COOL_DOWN_1;
					inButton.setText(this.cd1);
					inButton.forbid(1);
				}
			}
		}

		this.painter.paint();
	}

	/*	当用户 touch up 时执行..
	*	@param e : Event 事件
	*/
	this.touchup = function( e ){
		var _this = this;
		var x = Math.round(((e.clientX-this.ctxLeft)/this.ctxWidth)*this.horiPxlAmt);
		var y = Math.round(((e.clientY-this.ctxTop)/this.ctxHeight)*this.vertiPxlAmt);
		this.painter.traverse(function(cpt){
			if((cpt instanceof Button)&&(cpt.isIn(x,y))&&(!cpt.forbidden)){
				if(cpt.type==2) cpt.up();
			}
		});
		this.painter.paint();
	}

	/*	当用户 touch move 时执行..
	*	@param e : Event 事件
	*/
	this.touchmove = function( e ){

	}
}

/*	绘图器
*	@param ctx : 画板
*	@param W : 画板横向像素数
*	@param H : 画板纵向像素数
*	@param map : 全图元件链表
*/
function Painter( ctx, W, H, map ){
	//--------变量--------
	if(ctx){//画板
		this.ctx = ctx;
		if(W) this.W = W;
		if(H) this.H = H;
	}
	if(map) this.map = map;//元件表
	else this.map = new ComponentChain();

	//--------函数--------
	/*	添加一个新的 Component
	*	@param cpt : 新的 Component
	*	@return 为新 Compoenent 分配的 ID
	*/
	this.addComponent = function( cpt ){
		return this.map.addComponent(cpt);
	}

	/*	遍历全部元件并执行动作
	*	@param func(Component) : 执行的动作
	*/
	this.traverse = function( func ){
		this.map.traverse(func);
		return;
	}

	//根据 ID 删除元件，并返回删除的元件（找不到则返回 false ）
	this.deleteComponent = function( id ){
		return this.map.deleteComponent(id);
	}

	//根据 ID 获得元件
	this.getComponent = function( id ){
		return this.map.getComponent(id);
		return;
	}

	//获得链表长度
	this.getLength = function(){
		return this.map.getLength(id);
	}

	/*	将所有元件画到画板上
	*	@param ctx : 画板
	*/
	this.paint = function(){
		var _this = this;
		this.ctx.clearRect(0,0,this.W,this.H);
		this.map.traverse(
			function(cpt){
				cpt.paint(_this.ctx);
		});
	}
}

/*	元件链表
*	@param cpt : 初始Component
*	元件链表要求所有元件以 z 值由小到大的顺序排列
*/
function ComponentChain( cpt ){
	//--------变量--------
	if(cpt) this.cpt = cpt;
	else this.cpt = new Component();
	this.cpt.id = -1;// 如果值为 -1 则视作该 Component 不存在
	this.id_index = 0;//下一个自动分配的 id

	//--------函数--------
	/*	添加一个新的 Component
	*	@param cpt : 新的 Component
	*	@return 为新 Compoenent 分配的 ID
	*/
	this.addComponent = function( new_cpt ){
		var temp = this.cpt;
		var option = 1;
		//判断 option 和 temp：
		//0:加在 this.cpt 前面; 1:加在 temp 后面; -1:直接设置 this.cpt 为 new_cpt
		if(temp.id===-1){
			option = -1;
		}
		else if(new_cpt.z < temp.z){
			option = 0;
		}
		else if(new_cpt.z == temp.z){
			option = 1;
		}
		else{
			while(temp.next&&temp.next.id!=-1){
				if(new_cpt.z < temp.next.z){
					break;
				}
				temp = temp.next;
			}
		}
		//根据 option 执行：
		switch(option){
			//直接设置 this.cpt 为 new_cpt
			case -1:
			this.cpt = new_cpt;
			break;
			//加在 this.cpt 前面;
			case 0:
			new_cpt.next = this.cpt;
			this.cpt = new_cpt;
			break;
			//加在 temp 后面
			case 1:
			var next = temp.next;
			temp.next = new_cpt;
			new_cpt.next = next;
			break;
		}
		return new_cpt.id = this.id_index++;
	}

	/*	遍历全部元件并执行动作
	*	@param func(Component) : 执行的动作
	*/
	this.traverse = function( func ){
		var temp = this.cpt;
		if(temp) func(temp);
		while(temp.next&&temp.next.id!=-1){
			temp = temp.next;
			func(temp);
		}
		return;
	}

	//根据 ID 获得元件
	this.getComponent = function( id ){
		var temp = this.cpt;
		if(temp.id===-1||id===-1){
			return
		}
		if(temp.id===id){
			return temp;
		}
		while(temp.next&&temp.next.id!=-1){
			if(temp.next.id===id){
				return temp.next;
			}
			temp = temp.next;
		}
		return;
	}

	//根据 ID 删除元件，并返回删除的元件（找不到则返回 false ）
	this.deleteComponent = function( id ){
		var temp = this.cpt;
		var res = false;
		if(temp.id === id){
			this.cpt = temp.next;
			res = this.cpt;
		}
		else{
			while(temp.next&&temp.next.id!=-1){
				if(temp.next.id === id){
					res = temp.next;
					temp.next = temp.next.next;
				}
				else temp = temp.next;
			}
		}
		return res;
	} 

	//获得链表长度
	this.getLength = function(){
		var temp = this.cpt;
		var res = 1;
		if(!temp||temp.id===-1){
			return 0;
		}
		while(temp.next&&temp.next.id!=-1){
			res++;
			temp = temp.next;
		}
		return res;
	}

	this.toString = function(){
		var temp = this.cpt;
		if(!temp) return "0{}";
		var text = temp+" , ";
		var total = 1;
		while(temp.next&&temp.next.id!=-1){
			total += 1;
			temp = temp.next;
			text += temp+" , ";
		}
		return total+" { "+text+" }";
	}
}

/*	元件
*	@param img : Image 图像
*	@param x : 中心点位置x（pixel） 
*	@param y : 中心点位置y（pixel） 
*	@param w : 宽度（pixel） 
*	@param h : 高度（pixel） 
*	@param z : 层（数值大的图像将覆盖数值小的图像）
*	@param alpha : 透明度（0-1，0：完全透明，1：完全不透明）
*	@param text : 文本描述
*	@param display : 布尔值，true： 显示图像，false：隐藏图像
*/
function Component( img, x, y, w, h, z, alpha, text, display ){

	//--------变量--------
	this.img;
	this.next;//下一个元件
	this.id = -1;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.z = 0;
	this.alpha = 1;
	this.text = "";
	this.display = true;
	if(img) this.img = img;
	if(x) this.x = x;
	if(y) this.y = y;
	if(w) this.w = w;
	if(h) this.h = h;
	if(z) this.z = z;
	if(alpha) this.alpha = alpha;
	if(text) this.text = text;
	if(display) this.display = display;
	
	//--------函数--------

	//设置图像大小为 size（pixel） （即宽高皆为 size ）
	this.setSize = function(size){
		this.w = this.h = size;
		return;
	}

	//在画板 ctx 上绘图
	this.paint = function(ctx){
		if(!this.display) return;
		var oldGlobalAlpha = ctx.globalAlpha;
		var oldStrokeStyle = ctx.strokeStyle;
		ctx.globalAlpha = this.alpha;
		ctx.strokeStyle = "#DDD";

		if(this.img) ctx.drawImage(this.img,this.x-this.w/2,this.y-this.h/2,this.w,this.h);

		ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
		ctx.textAlign = 'center'; //设置文本的水平对对齐方式
		ctx.fillText(this.text, this.x, this.y);

		ctx.globalAlpha = oldGlobalAlpha;
		ctx.strokeStyle = oldStrokeStyle;
	}

	//坐标（ x, y ）位于该元件所在区域
	this.isIn = function(x,y){
		return (x>this.x-this.w/2)&&(x<this.x+this.w/2)&&(y>this.y-this.h/2)&&(y<this.y+this.h/2);
	}

	this.toString = function(){
		return this.id+"-"+this.text;
	}
}

/*	文字（继承元件）
*	@param text : 第一行文本
*	@param text2 : 第二行文本
*	@param text3 : 第三行文本
*/
function Text( text, text2 ){

	//--------变量--------
	this.animating = false;//正在播放动画
	if(text) this.text=text;
	if(text2) this.text2=text2;

	//--------函数--------
	//潜化
	this.dive = function(){
		this.alpha = 0.6;
	}
	//实化
	this.undive = function(){
		this.alpha = 1;
	}
	//在画板 ctx 上绘图
	this.paint = function(ctx){
		if(!this.display) return;
		var oldGlobalAlpha = ctx.globalAlpha;
		var oldStrokeStyle = ctx.strokeStyle;
		ctx.globalAlpha = this.alpha;
		ctx.strokeStyle = "#DDD";

		ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
		ctx.textAlign = 'center'; //设置文本的水平对对齐方式
		
		if(this.text2&&this.text3){
			ctx.fillText(this.text, this.x, this.y-this.h);
			ctx.fillText(this.text2, this.x, this.y);
			ctx.fillText(this.text3, this.x, this.y+this.h);
		}
		else if(this.text2){
			ctx.fillText(this.text, this.x, this.y-this.h/2);
			ctx.fillText(this.text2, this.x, this.y+this.h/2);
		}
		else ctx.fillText(this.text, this.x, this.y);

		ctx.globalAlpha = oldGlobalAlpha;
		ctx.strokeStyle = oldStrokeStyle;
	}

	//动画
	this.animate = function(action,speed,frame,func,val){
		var _this = this;
		switch(action){
			case "disappear":
			this.t = 0;//计时器
			if(!this.animating){
				this.animating = true;
				this.oldText = this.text;
				this.oldAlpha = this.alpha;
				this.oldY = this.y;
			}
			else{
				clearInterval(this.itv);//停止动画
				this.alpha = this.oldAlpha;
				this.y = this.oldY;
			}
			this.text = val;
			this.itv = setInterval(function(){//动画开始
				if(_this.t>=frame){
					clearInterval(_this.itv);//停止动画
					_this.animating = false;
					_this.alpha = _this.oldAlpha;
					_this.y = _this.oldY;
					_this.text = _this.oldText;
				}
				else{
					_this.y -= 4;
					_this.alpha -= 1/(frame*1.1);
				}
				_this.t+=1;
				func();
			},speed)
			break;
			case "fringe":

			break;
		}
		return;
	}

};Text.prototype = new Component();

/*	按钮（继承元件）
*	@param type : 按钮类型（0：数字， 1：符号， 2：功能）
*	@param imgsrc1 : 未按下按钮的图像地址
*	@param font : 字体文本（可选）
*	@param imgsrc2 : 按下按钮后的图像地址（可选）
*/
function Button( type, imgsrc1, font, imgsrc2){

	//--------变量--------

	this.img = new Image();//未按下按钮的图像
	this.img2 = new Image();//按下按钮后的图像
	this.type = 0;
	this.font = "bold 10px";
	this.pressed = false;//被按下的
	this.forbidden = false;//被禁用的
	this.nextText = this.text;//将要改变的值
	this.display = true;
	if(type)this.type = type;
	if(imgsrc1)this.img.src = imgsrc1;
	if(imgsrc2)this.img2.src = imgsrc2;
	if(font)this.font = font;

	//--------函数--------

	//设置 text
	this.setText = function(text){
		this.text = text;
		this.nextText = text;
	}

	//凹陷
	this.down = function(){
		if(this.forbidden) return;
		if(!this.pressed){
			this.pressed = true;
		}
	}

	//凸起
	this.up = function(){
		if(this.forbidden) return;
		if(this.pressed){
			this.pressed = false;
		}
	}

	//转换 凹陷 和 凸起
	this.switchImage = function(){
		if(this.forbidden) return;
		this.pressed = this.pressed?false:true;
	}

	//禁用
	this.forbid = function(val){
		if(!this.forbidden){
			this.forbidden = true;
			this.alpha = val;
		}
	}

	//接触禁用
	this.unforbid = function(){
		if(this.forbidden){
			this.forbidden = false;
			this.alpha = 1.0;
		}
	}

	//启用
	this.activate = function(){
		if(this.forbidden){
			this.forbidden = false;
			this.alpha = 1;
		}
	}

	//是否为数字按钮
	this.isDigit = function(){
		return this.type === 0;
	}

	//是否为符号按钮
	this.isSymbol = function(){
		return this.type === 1;
	}

	//是否为功能按钮
	this.isFunction = function(){
		return this.type === 2;
	}

	//绘图
	this.paint = function(ctx){
		if(!this.display) return;
		var oldGlobalAlpha = ctx.globalAlpha;
		var oldFillStyle = ctx.fillStyle;
		ctx.globalAlpha = this.alpha;
    	ctx.font = this.font;
		ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
		ctx.textAlign = 'center'; //设置文本的水平对对齐方式
		if(!this.pressed){
    		Button.prototype.paint.apply(this, arguments);
		}
		else{
			ctx.drawImage(this.img2,this.x-this.w/2,this.y-this.h/2,this.w,this.h);
			ctx.fillStyle = this.type==0?DIGITBUTTON_DOWN_TEXTCOLOR:BACKGROUND_COLOR;
		}
		ctx.fillText(this.text, this.x, this.y);
    	ctx.globalAlpha = oldGlobalAlpha;
    	ctx.fillStyle = oldFillStyle;
	}

	/*	执行动画
	*	@param action : 执行的动画名字（"change":更换数字，"fringe":重影）
	*	@param speed : 动画播放速度（毫秒/帧）
	*	@param frame : 动画帧数
	*	@param func : 每帧执行函数
	*	@param text : 更换数字的值（可选）
	*/
	this.animate = function(action,speed,frame,func,text){
		if(this.forbidden) return;
		var _this = this;
		switch(action){
			case "change":
			if(this.type===0){//如果是数字按钮并且text存在
				var t = 0;//计时器
				var oldSize = this.w;
				var oldAlpha = this.alpha;
				this.nextText = text;
				this.forbidden = true;//禁用
				var itv = setInterval(function(){//动画开始
					if(t>=frame){
						clearInterval(itv);//停止动画
						_this.forbidden = false;//启用
						_this.setSize(oldSize);
						_this.alpha = oldAlpha;
					}
					else if(t>=frame/2){
						if(_this.nextText!=_this.text) _this.text = _this.nextText;
						_this.setSize(_this.w*(1-0.6/frame));
						_this.alpha+=1.9/frame;
					}
					else{
						_this.setSize(_this.w*(1+0.6/frame));
						_this.alpha-=1.9/frame;
					}
					t+=1;
					func();
				},speed)
			}
			break;
			case "fringe":

			break;
		}
		return;
	}

};Button.prototype = new Component();

/*	背景（继承元件）
*	@param color : 颜色
*/
function Background(color){

	//--------变量--------
	this.z=-1;
	if(color)this.color=color;

	//--------函数--------
	//绘图
	this.paint = function(ctx){
		var oldGlobalAlpha = ctx.globalAlpha;
		var oldFillStyle = ctx.fillStyle;
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = this.color;

		ctx.fillRect(this.x-this.w/2,this.y-this.h/2,this.w,this.h);

    	ctx.globalAlpha = oldGlobalAlpha;
    	ctx.fillStyle = oldFillStyle;
	}

};Background.prototype = new Component();
