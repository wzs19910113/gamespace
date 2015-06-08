function Runner(all)
{
	//------------属性------------
	this.all = new Team();
	this.dinfo1 = $("#info1");
	this.dinfo2 = $("#info2");
	this.dinfo3 = $("#info3");
	this.dinfo4 = $("#info4");
	this.dinfo5 = $("#info5");
	this.dinfo6 = $("#info6");
	this.dwindow = $("#window");
	this.dpanel1 = $("#panel_1");
	this.dpanel2 = $("#panel_2");
	this.dpanel3 = $("#panel_3");
	this.dpanel4 = $("#panel_4");
	this.dpanel5 = $("#panel_5");
	
	if(all) this.all = all;
	
	//------------函数------------
	//执行
	this.exec = function(){
		var res = "";
		var test = 0;
		//------------声明变量------------
		var all = this.all;
		var players = this.all.players;
		var dinfo1 = this.dinfo1;
		var dinfo2 = this.dinfo2;
		var dinfo3 = this.dinfo3;
		var dinfo4 = this.dinfo4;
		var dinfo5 = this.dinfo5;
		var dinfo6 = this.dinfo6;
		var dinfo2pfx = dinfo2.text();//固定字符串
		var dinfo3pfx = dinfo3.text();
		var dinfo4pfx = dinfo4.text();
		var dinfo5pfx = dinfo5.text();
		var dinfo6pfx = dinfo6.text();
		var dwindow = this.dwindow;
		var dpanel1 = this.dpanel1;
		var dpanel2 = this.dpanel2;
		var dpanel3 = this.dpanel3;
		var dpanel4 = this.dpanel4;
		var dpanel5 = this.dpanel5;
		
		var play = false;//游戏进行
		var cursor = 0;//鼠标状态：0-默认 | 1-选择攻击 | 2-选择绑定 | 3-选择血盾施加
		
		/*动作信息
			desc:描述(string) |
			actor:行动者(Player) |
			action:动作(string)
			{
				r：恢复 |
				s：强化 |
				a: 攻击 |
				w：加权 |
				l: 置后 |
			}|
			object:攻击对象(Player) |
			object2:绑定对象(Player) |
			object3:血盾施加对象(Player) |
			objects:攻击对象组(Player Array) |
			suck:是否吸血(boolean) |
			selfup:是否可自愈(boolean) |
		*/
		var action = new Array("desc","actor","action","object","object2","object3","objects","suck","selfup");
		
		var teams = getTeams();//阵营数组
		var aliveNum = getAliveNum();//存活玩家数量
		var round = 1;//回合
		var model = (teams==-1?0:1);//模式: 0-竞技场 | 1-荣誉
		if(model==0){
			dinfo6.text(dinfo6pfx+"竞技场");
			var txt = "";
			txt += "竞技场模式：所有玩家都是独立的;";
			txt += "\n对每个玩家而言，胜利的唯一条件为：所有其他玩家都已死亡;";
			txt += "\n每个玩家都拥有【吸血】能力";
			dinfo6.attr("title",txt);
			action["suck"]=true;
		}
		else if(model==1){
			dinfo6.text(dinfo6pfx+"荣誉");
			var txt = "";
			txt += "荣誉模式：玩家属于阵营;";
			txt += "\n对每个阵营而言，胜利的唯一条件为：所有其他阵营的玩家都已死亡";
			dinfo6.attr("title",txt);
		}
		action["selfup"] = true;//可自愈
		action["bind"] = false;//非绑定
		
		var actors = all;//行动者队伍
		var laterActors = new Team;//后置行动者队伍
		var canLate = 1;//可置后: 0-不可 | 1-可 |
		var actorsIndex = 0;//行动者队伍指针
		var nextActorNo = getRandom(1,actors.players.length);//下回合的行动者数
		var teamWinner = new Team();//获胜阵营
		var playerWinner = new Player();//获胜玩家
		/*下一步step指针：
			0-游戏开始 | 
			1-选择行动 | 
			2-完成行动 | 
			3-玩家阵亡 | 
			4-阵营灭亡 | 
			5-回合结束 | 
			6-回合开始 | 
			7-游戏结束 |
		
		*/
		var ns = 0;
		var cs = 0;//当前step指针（值意同ns）
		var rq = 0;//是否提示【请选择行动】
		
		//------------绑定按钮-----------
		
		//按下【下一步】按扭
		dpanel5.children().eq(0).bind("click",function(){
			step();
		});
		//键盘事件
		$("body").keydown(function(event){
			var key = (String.fromCharCode(event.which)).charAt(0);
			if(event.which==13||event.which==32){//回车或空格
				step();
			}
			else{
				switch(key){
					case 'R':{//r-恢复
						$("#o1").click();
						break;
					}
					case 'S':{//s-强化
						$("#o2").click();
						break;
					}
					case 'A':{//a-攻击
						$("#o3").click();
						break;
					}
					case 'W':{//w-加权
						$("#o4").click();
						break;
					}
					case 'L':{//l-置后
						$("#o5").click();
						break;
					}
				}
			}
		});
		
		//------------执行动作------------
		
		step();
		
		//进行下一步
		function step(){
			//--------执行--------
			switch(ns){
				case 0:{//游戏开始
					cs = 0;
					ns = 6;
					play = true;
					disp();//第一次显示界面
					log("游戏开始!<br/>");
					log(dinfo6.text(),1);
					break;
				}
				case 1:{//选择行动
					cs = 1;
					
					var cont = true;//是否执行完这一步
					
					//如果被绑定
					if(action["actor"].isBound){
						ns = 10;
						action["actor"].unbind();
						cont = false;
						step();
					}
					
					if(cont){
						//检查是否有【自愈】能力
						var hasSelfUp = action["actor"].role.skillSet.getByType(2);
						if(hasSelfUp!=false
							&&action["selfup"]
							&&round!=1
							&&canLate){//如果有【自愈】能力
							if(action["actor"].canSelfUp()){
								ns = 9;
								action["selfup"] = false;
								cont = false;
								step();
							}
						}
					}
					
					if(cont){
						disp();//更新界面
						show(action["actor"]);
						if(action["actor"].isComputer){//如果是电脑，则自动生成action
							log(action["actor"].name+" 开始行动...<br/>");
							action["action"] = AI(action["actor"]);
						}
						
						if(action["action"]!=undefined){//如果action存在，进入下一步
							ns = 2;
							rq = 0;
							if(!action["actor"].isComputer){
								step();
							}
						}
						else{
							if(rq){
								log("请选择行动!<br/>");
							}
							else{
								log(action["actor"].name+" 开始行动...<br/>");
								rq = 1;
							}
						}
					}
					break;
				}
				case 2:{//完成行动
					cs = 2;
					act();//执行动作
					disp();//更新界面
					dispOperation(0);
					dispDetail(action["actor"].id);
					var currentDeath = getCurrentDeath();//(int)当前死亡玩家数
					if(currentDeath>0){//如果出现当前死亡玩家
						ns = 3;//下一步为玩家死亡
					}
					else{
						clearOps();
						
						//配置下次行动的数据
						setNextAction();
					}
					
					break;
				}
				case 3:{//玩家死亡
					cs = 3;
					//通报当前阵亡玩家
					for(var i=0;i<players.length;i++){
						if(players[i].op["act"]==13){
							log(desc(players[i]),1);
							players[i].initOp();
							players[i].dead();
							all.getByID(players[i].killer).kill += 1;
							dispDetail(players[i].killer);
						}
					}
					disp();
					//检查是否有阵营全灭
					var teamDeath = 0;
					playerWinner = playerWin();
					if(model==1){
						for(var i=0;i<teams.length;i++){
							if(getTeamAliveNum(teams[i].id)==0&&teams[i].alive){
								teamDeath += 1;
							}
						}
					}
					if(teamDeath!=0){
						ns = 4;//下一步为阵营全灭
					}
					else if(playerWinner!=-1){//如果竞技场模式中有唯一玩家存活
						ns = 7;//游戏结束
					}
					else{
						clearOps();
						
						//配置下次行动的数据
						setNextAction();
					}
					break;
				}
				case 4:{//阵营全灭
					cs = 4;
					for(var i=0;i<teams.length;i++){
						if(getTeamAliveNum(teams[i].id)==0&&teams[i].alive){
							teams[i].alive = false;
							log(teams[i].name+" 已被完全消灭...<br/>",1);
						}
					}
					//检查游戏是否结束
					teamWinner = teamWin();
					if(teamWinner!=-1){//如果胜利
						ns = 7;//下一步为游戏结束
					}
					else{
						clearOps();
						
						//配置下次行动的数据
						setNextAction();
					}
					
					break;
				}
				case 5:{//回合结束
					cs = 5;
					ns = 6;
					
					//清空行动者
					actors = new Team();
					for(var i=0;i<players.length;i++){
						players[i].isActor = false;
					}
					
					disp();//更新界面
					dispDetail(0);
					dispOperation(0);
					//配置下回合数据
					round ++;
					actorsIndex = 0;
					aliveNum = getAliveNum();//存活玩家数量
					actors = getActors();
					nextActorNo = getNextActorNo();//下回合的行动者数
					
					log("本回合结束<br/>",1);
					break;
				}
				case 6:{//回合开始
					cs = 6;
					ns = 1;
					rq = 0;
					action["actor"] = actors.players[actorsIndex];
					canLate = 1;
					dispDetail(action["actor"].id);
					disp();//显示界面
					log("第 "+round+" 回合开始:<br/>");
					var txt = "本回合的行动者为：<br/>";
					for(var i=0;i<actors.players.length;i++){
						txt += actors.players[i].name+"["+actors.players[i].role.name+"]<br/>";
					}
					log(txt);
					txt = "(下回合将有 "+nextActorNo+" 位行动者)<br/>";
					log(txt,1);
					break;
				}
				case 7:{//游戏结束
					cs = 7;
					ns = 8;
					victory();
					if(model==1){
						log(teamWinner.name+" 获得了胜利！<br/>",1);
					}
					else if(model==0){
						log(playerWinner.name+" 获得了胜利！<br/>",1);
					}
					break;
				}
				case 8:{//游戏结束后
					cs = 8;
					log("游戏结束;)<br/>");
					break;
				}
				case 9:{//自愈能力通告
					cs = 9;
					ns = 1;
					action["actor"].selfUp();
					log(desc(action["actor"])+"<br/>");
					action["actor"].initOp();
					disp();
					show(action["actor"]);
					break;
				}
				case 10:{//解除绑定通告
					cs = 10;
					log(desc(action["actor"])+"<br/>");
					disp();//更新界面
					dispOperation(0);
					dispDetail(action["actor"].id);
					var currentDeath = getCurrentDeath();//(int)当前死亡玩家数
					if(currentDeath>0){//如果出现当前死亡玩家
						ns = 3;//下一步为玩家死亡
					}
					else{
						action["actor"].initOp();
						
						//配置下次行动的数据
						setNextAction();
					}
					break;
				}
				default:{
					cs = -1;
					ns = -1;
					log("【程序错误005】<br/>");
					break;
				}
			}
			
			//--------函数--------
			//根据action执行动作
			function act(){
				var validAction = true;//action 是否符合规则
				//变更数据
				switch(action["action"]){
					case "r":{//恢复
						action["actor"].r();
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "s":{//强化
						action["actor"].s();
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "a":{//攻击
						action["actor"].a(action["object"],(action["suck"]?true:false));
						action["desc"] = desc(action["actor"],action["object"]);
						if(action["object"].op["act"]==13){
							action["object"].killer = action["actor"].id;
						}
						log(action["desc"]+"<br/>");
						break;
					}
					case "w":{//加权
						action["actor"].w();
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "shield":{//启动护盾
						action["actor"].shieldOpen();
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "sacrifice":{//牺牲
						action["actor"].sacrifice(true);
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "bind":{//绑定
						action["actor"].bind(action["object2"]);
						action["desc"] = desc(action["actor"],action["object2"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "fire":{//蓄能
						action["actor"].fire();
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "bloodshield":{//血盾
						action["actor"].bloodshieldOpen(action["object3"]);
						action["desc"] = desc(action["actor"],action["object3"]);
						log(action["desc"]+"<br/>");
						break;
					}
					case "l":{//置后
						laterActors.add(action["actor"]);
						action["actor"].op["act"]=14;
						action["desc"] = desc(action["actor"]);
						log(action["desc"]+"<br/>");
						break;
					}
					default:{
						validAction = false;
						break;
					}
				}
			}
			//配置下一次行动的数据
			function setNextAction(){
				clearAction();//清空action
				if(actorsIndex==actors.players.length-1){//如果当前行动者是最后一个行动者
					if(laterActors.players.length>0){
						actors = laterActors;
						actorsIndex = 0;
						action["actor"] = actors.players[actorsIndex];
						laterActors = new Team();
						canLate = 0;//本回合不可置后
						ns = 1;
					}
					else{
						ns = 5;//回合结束
					}
				}
				else{
					ns = 1;//允许下一个行动者行动
					actorsIndex++;
					action["actor"] = actors.players[actorsIndex];
				}
			}
			//获取前死亡玩家数
			function getCurrentDeath(){
				var res = 0;
				for(var i=0;i<players.length;i++){
					if(players[i].op["act"]==13){
						res ++;
					}
				}
				return res;
			}
			//清空action
			function clearAction(){
				action = new Array("desc","actor","action","object","object2","objects","suck","selfup");
				if(model==0) action["suck"]=true;
				action["selfup"] = true;//可自愈
			}
			//清空所有玩家op
			function clearOps(){
				for(var i=0;i<players.length;i++){
					players[i].initOp();
				}
			}
			//生成下回合行动者数
			function getNextActorNo(){
				var res = 0;
				if(aliveNum>2){
					res = getRandom(1,aliveNum);
				}
				else if(aliveNum==2){
					var r = getRandom(1,5);
					res = (r==1)?2:1;
				}
				else{
					log("【程序错误001】<br/>");
				}
				return res;
			}
			//获得电脑行为
			function AI(C){
				var res = "";
				var acts = new Array();
				var txt = "";//@TEST
				
				//设置参考数据
				var canShield = C.role.skillSet.getByType(1)!=false?true:false;//(bool)拥有【护盾】技能
				var canSelfup = C.role.skillSet.getByType(2)!=false?true:false;//(bool)拥有【自愈】技能
				var canSacrifice = C.role.skillSet.getByType(3)!=false?true:false;//(bool)拥有【牺牲】技能
				var canBind = C.role.skillSet.getByType(4)!=false?true:false;//(bool)拥有【绑定】技能
				var canFire = C.role.skillSet.getByType(5)!=false?true:false;//(bool)拥有【蓄能】技能
				var canSuck = C.role.skillSet.getByType(6)!=false?true:false;//(bool)拥有【吸血】技能
				var totalHP = 0;//敌对玩家总体力
				var totalWeight = 0;//敌对玩家总权重
				var totalEnemy = 0;//敌对人数
				var totalAlive = 0;//存活人数
				var totalFriend = 0;//存活友军
				var fireLevel = canFire?C.buffSet.getByType(4).level:0;//能级(没有蓄能技能则为 0 )
				for(var i=0;i<players.length;i++){
					if(model==1&&players[i].team!=C.team&&players[i].alive){
						totalHP += players[i].cp;
						totalWeight += players[i].weight;
						totalEnemy ++;
					}
					if(model==1&&players[i].team==C.team&&players[i].alive&&players[i].id!=C.id){
						totalFriend ++;
					}
					else if(model==0&&players[i].alive){
						totalHP += players[i].cp;
						totalWeight += players[i].weight;
						totalEnemy ++;
					}
					if(players[i].alive){
						totalAlive ++;
					}
				}
				
				//第一回合
				if(round==1){
					acts.push("s");
					acts.push("s");
					acts.push("w");
					if(canShield){
						acts.push("shield");
						acts.push("shield");
					}
					if(canFire){
						acts.push("fire");
						acts.push("fire");
					}
					if(totalAlive<=2){
						for(var i=0;i<3;i++) acts.push("w");
					}
				}
				//其他回合
				else{
					var mustKill = 0;//有必杀玩家 0-没有 | 1-有
					//基本操作倾向值
					var raim = 0;//恢复倾向值
					var saim = 0;//强化倾向值
					var aaim = 0;//攻击倾向值
					var waim = 0;//加权倾向值
					//技能倾向值
					var shieldaim = 0;//护盾倾向值
					var sacrificeaim = 0;//牺牲倾向值
					var bindaim = 0;//绑定倾向值
					var fireaim = 0;//蓄能倾向值
					
					var SID = 0;
					var canAttack = checkO3().length==0?true:false;//(bool)可以进行攻击
					if(canAttack) SID = getAttackObject();//获得攻击对象
					if(SID!=0){
						aaim ++;
						action["object"] = all.getByID(SID);//设置攻击对象
					}
					
					//如果没有必杀玩家，可进行其他动作
					if(mustKill==0){
						//------------设置倾向值-------------
						//设置强化倾向
						saim ++;
						if(C.role.skillSet.getByType(5)!=false){
							saim += parseInt(totalHP/(C.ak+1))+C.buffSet.getByType(4).level;
						}
						else{
							saim += parseInt((parseInt(totalHP/totalEnemy)^2)/(C.ak+1));
						}
						if((C.tp<=C.cp)||(C.tp-C.cp)>(C.ak*2)){
							saim += C.tp-C.cp;
						}
						if(saim<=0){
							saim = 1;
						}
						//设置恢复倾向
						if(C.ak>0){
							var fireLevel = C.buffSet.getByType(4).level!=false?C.buffSet.getByType(4):0;
							var sup = C.ak*(fireLevel+1);
							if(model==1){
								if(C.tp-C.cp>0) raim += C.tp-C.cp+C.ak;
								else if(C.tp<=(sup*2)&&sup>4) raim += parseInt((sup/(C.tp+1))*sup);
							}
							else if(model==0){
								if(SID==0||A==0){
									if(C.tp-C.cp>0) raim += C.tp-C.cp+sup;
									else if(C.tp<=(sup*2)&&sup>4) raim += parseInt((sup/(C.tp+1))*sup);
								}
							}
						}
						//设置加权倾向
						if(totalAlive==2){
							waim += parseInt((totalWeight-C.weight)*5/(totalWeight+1));
						}
						else{
							waim += (parseInt(totalWeight/(totalEnemy+1))-C.weight)^2;
						}
						//设置启动护盾倾向
						if(canShield){
							var exist = action["actor"].buffSet.getByType(1)!=false?true:false;//(bool)护盾已存在
							if(!exist){
								shieldaim += C.tp-C.ak;
							}
						}
						//设置牺牲倾向
						if(canSacrifice){
							var can = (totalFriend==0&&C.ak!=0&&C.buffSet.getByType(2)==false);//(bool)条件允许
							if(can){
								sacrificeaim += 1;
								var exist = action["actor"].buffSet.getByType(1)!=false?true:false;//(bool)存在护盾
								if(exist){
									sacrificeaim += (C.cp-C.ak)*2;
								}
							}
						}
						//设置绑定倾向
						if(canBind){
							var BID = getBindObject();
							if(BID!=0){
								bindaim ++;
								action["object2"] = all.getByID(BID);
							}
						}
						//设置蓄能倾向
						if(canFire){
							fireaim = C.cp - fireLevel;
						}
						
						//条件整合
						conditionAdjust();
					}
					
					//设置acts
					for(var i=0;i<raim;i++) acts.push("r");
					for(var i=0;i<saim;i++) acts.push("s");
					for(var i=0;i<aaim;i++) acts.push("a");
					for(var i=0;i<waim;i++) acts.push("w");
					for(var i=0;i<shieldaim;i++) acts.push("shield");
					for(var i=0;i<sacrificeaim;i++) acts.push("sacrifice");
					for(var i=0;i<bindaim;i++) acts.push("bind");
					for(var i=0;i<fireaim;i++) acts.push("fire");
				}
				res = acts[getRandom(0,acts.length)];
				
				//@TEST
				if(test){
					var r=s=a=w=shield=sacrifice=bind=fire=0;
					for(var i=0;i<acts.length;i++){
						switch(acts[i]){
							case "r": r++;break;
							case "s": s++;break;
							case "a": a++;break;
							case "w": w++;break;
							case "shield": shield++;break;
							case "sacrifice": sacrifice++;break;
							case "bind": bind++;break;
							case "fire": fire++;break;
						}
					}
					//alert("r:"+r+"\ns:"+s+"\na:"+a+"\nw:"+w+"\nshield:"+shield+"\nsacrifice:"+sacrifice+"\nbind:"+bind+"\nfire:"+fire);//@TEST
					log("r:"+r+"| s:"+s+"| a:"+a+"| w:"+w+"| sh:"+shield+"| sa:"+sacrifice+"| b:"+bind+"| f:"+fire+"<br/>");//@TEST
				}
				//----函数----
				//获得攻击对象ID: 0-没有可攻击的对象
				function getAttackObject(){
					var res = 0;
					var A = action["actor"];//当前行动者
					var objs1 = new Array();//(int)可攻击ID数组
					var objs2 = new Array();//(int)决断ID数组
					var objs3 = new Array();//(int)必杀ID数组
					//筛选可攻击玩家ID
					for(var i=0;i<players.length;i++){
						if(model==1){
							if(players[i].alive&&!players[i].isActor&&players[i].team!=A.team){
								objs1.push(players[i].id);
							}
						}
						else if(model==0){
							if(players[i].alive&&!players[i].isActor){
								objs1.push(players[i].id);
							}
						}
					}
					//获得决断ID数组+必杀ID数组
					for(var i=0;i<objs1.length;i++){
						var P = all.getByID(objs1[i]);
						var bindDamage = P.buffSet.getByType(3)!=false?1:0;//绑定附加伤害
						var trueDamage = 0;//攻击后能造成的真实伤害
						
						trueDamage = A.ak*(1+fireLevel)+bindDamage;
						if(P.role.skillSet.getByType(8)!=false&&trueDamage<=P.ak){//根据【无敌】计算真实伤害
							trueDamage = 0;
						}
						
						if(P.cp<=trueDamage&&P.buffSet.getByType(1)==false){//如果目标体力小于自己所能造成的伤害，且没有护盾
							objs3.push(P.id);
						}
						if(objs3.length==0){
							var aim = 0;//杀意值
							if(!P.buffSet.getByType(1)==false){//如果对方有护盾
								aim += P.ak+A.ak;
							}
							else{//如果对方没有护盾
								aim += trueDamage;
							}
							for(var j=0;j<aim;j++){
								objs2.push(P.id);
								if(canSuck){
									aaim ++;
								}
							}
							aaim += parseInt(aim/(totalEnemy+1))*2;
						}
					}
					//如果有必杀ID数组
					if(objs3.length>0){
						objs2 = new Array();
						mustKill = 1;//必然选择攻击
						var mostAim = 0;//最高杀意值
						//获得最高杀意值
						for(var i=0;i<objs3.length;i++){
							var P = all.getByID(objs3[i]);
							if((P.ak+P.weight)>mostAim){
								mostAim = P.ak+P.weight;
							}
						}
						//从必杀数组中选取所有最高杀意值最大的玩家
						for(var i=0;i<objs3.length;i++){
							var P = all.getByID(objs3[i]);
							if((P.ak+P.weight)>=mostAim){
								objs2.push(P.id);
							}
						}
					}
					if(objs2.length>0){
						res = objs2[getRandom(0,objs2.length)];
					}

					return res;
				}
				//获得绑定对象ID：0-没有可绑定对象
				function getBindObject(){
					var res = 0;
					var objs1 = new Array();//(int)可绑定ID数组
					var objs2 = new Array();//(int)决断ID数组
					//筛选可绑定玩家ID
					for(var i=0;i<players.length;i++){
						if(model==1){
							if(players[i].alive&&!players[i].isActor&&players[i].team!=C.team&&!players[i].isBound){
								objs1.push(players[i].id);
							}
						}
						else if(model==0){
							if(players[i].alive&&!players[i].isActor&&!players[i].isBound){
								objs1.push(players[i].id);
							}
						}
					}
					//获得决断ID数组
					for(var i=0;i<objs1.length;i++){
						var P = all.getByID(objs1[i]);
						var aim = P.ak+P.weight+P.tp+P.cp;//绑定意值
						if(P.buffSet.getByType(1)!=false){//如果目标有护盾: +round 分
							var t = round;
							aim += t;
							for(var j=0;j<t;j++){
								objs2.push(P.id);
							}
						}
						if(P.buffSet.getByType(4)!=false){//如果目标有蓄能: +round*能级 分
							var t = round*(P.buffSet.getByType(4).level);
							aim += t;
							for(var j=0;j<t;j++){
								objs2.push(P.id);
							}
						}
						for(var j=0;j<aim;j++){
							objs2.push(P.id);
						}
						bindaim += parseInt(aim/round)+parseInt(aaim/2);
					}
					
					if(objs2.length>0){
						res = objs2[getRandom(0,objs2.length)];
					}
					return res;
				}
				//条件整合
				function conditionAdjust(){
					var P = action["actor"];
					//如果攻击目标和绑定目标是同一个对象，并且对象拥有护盾，则放弃攻击
					if(action["object2"]!=undefined&&action["object"]!=undefined
						&&action["object"].id==action["object2"].id
						&&action["object"].buffSet.getByType(1)!=false)
					{
						aaim = 0;
					}
					//如果行动者体力值满，并且已使用过【牺牲】，则放弃恢复
					if(P.cp>=P.tp&&P.buffSet.getByType(2)!=false){
						raim = 0;
					}
					//如果行动者体力值满，并且体力已达到上限，则放弃恢复
					if(P.cp>=P.tp&&P.tp>=maxHP){
						raim = 0;
					}
				}
				
				
				return res;
			}
			//生成新的actors
			function getActors(){
				var res = new Team();
				var weightArray = new Array();
				//生成权重数组
				for(var i=0;i<players.length;i++){
					if(players[i].alive){
						for(var j=0;j<players[i].weight;j++){
							weightArray.push(players[i].id);
						}
					}
				}
				//生成actors
				if(nextActorNo>aliveNum) nextActorNo = aliveNum;
				for(var i=0;i<nextActorNo;){
					var r = getRandom(0,weightArray.length);
					if(!res.hasPlayerByID(weightArray[r])){
						var newActor = all.getByID(weightArray[r]);
						newActor.actionNo = i+1;//分配行动者序号
						res.add(newActor);
						newActor.isActor = true;
						i++;
					}
				}
				//打乱actors的顺序
				
				return res;
			}
			//展现玩家信息
			function show(P){
				dispDetail(P.id);
				dispOperation(P.id);
			}
		}
		
		//添加游戏记录
		function log(txt,line){
			dpanel4.append("-->"+txt);
			if(line) dpanel4.append("<br/>");
			dpanel4.scrollTop(dpanel4[0].scrollHeight);
			dinfo1.text("");
			dinfo1.append(txt);
			dinfo1.attr("title",dinfo1.text());
		}
		
		/*根据Player获得其行为描述
			P-行动玩家（必需） |
			S-目标玩家（可选）
		*/
		function desc(P,S){
			var res = ext = "";
			var act = P.op["act"];
			var tp1 = P.op["tp1"];
			var cp1 = P.op["cp1"];
			var ak1 = P.op["ak1"];
			var cp2 = P.op["cp2"];
			var we1 = P.op["we1"];
			var hi = P.op["hi"];
			
			switch(act){
				case 0:{//无行动
					res += P.name+" 没有行动";
					break;
				}
				case 1:{//体力恢复
					res += P.name+" 恢复了";
					ext += "体力+"+cp1;
					break;
				}
				case 2:{//体力+体力上限恢复
					res += P.name+" 恢复了";
					ext += "体力/体力上限+"+cp1;
					break;
				}
				case 3:{//上限+体力+攻击强化
					res += P.name+" 进行了强化";
					ext += "体力/体力上限+"+cp1;
					ext += "，攻击+"+ak1;
					break;
				}
				case 4:{//攻击强化
					res += P.name+" 进行了强化";
					ext += "攻击+"+ak1;
					break;
				}
				case 5:{//攻击
					res += P.name+" 攻击了 "+S.name+"["+S.role.name+"]<br/>";
					ext += S.name+"["+S.role.name+"] 受到了 "+ S.op["cp2"] +" 点伤害";
					if(S.op["hi2"]>0&&S.op["hi"]!=2) ext += "，血盾值减少了 "+ S.op["hi2"];
					if(S.op["we2"]!=undefined&&S.op["we2"]>0){
						ext += "，权重减少了 "+ S.op["we2"];
						ext += "; "+P.name+" 提升了 "+ S.op["we2"] +" 点权重";
					}
					if(S.op["hi"]!=undefined&&S.op["hi"]==2){
						ext += "; "+S.name+"["+S.role.name+"] 失去了血盾";
					}
					break;
				}
				case 7:{//吸血（攻击+体力回复
					res += P.name+" 攻击了(吸血) "+S.name+"["+S.role.name+"]<br/>";
					ext += S.name+"["+S.role.name+"] 受到了 "+ S.op["cp2"] +" 点伤害";
					if(S.op["hi2"]>0&&S.op["hi"]!=2) ext += "，血盾值减少了 "+ S.op["hi2"];
					if(S.op["we2"]!=undefined&&S.op["we2"]>0) ext += "，权重减少了 "+ S.op["we2"];
					ext += "; "+P.name+" 恢复了 "+ P.op["cp1"] +" 点体力";
					if(S.op["we2"]!=undefined&&S.op["we2"]>0) ext += "，并提升了 "+ S.op["we2"] +" 点权重";
					if(S.op["hi"]!=undefined&&S.op["hi"]==2){
						ext += "; "+S.name+"["+S.role.name+"] 失去了血盾";
					}
					break;
				}
				case 8:{//吸血（攻击+体力+体力上限回复）
					res += P.name+" 攻击了(吸血) "+S.name+"["+S.role.name+"]<br/>";
					ext += S.name+"["+S.role.name+"] 受到了 "+ S.op["cp2"] +" 点伤害";
					if(S.op["hi2"]>0&&S.op["hi"]!=2) ext += "，血盾值减少了 "+ S.op["hi2"];
					if(S.op["we2"]!=undefined&&S.op["we2"]>0) ext += "，权重减少了 "+ S.op["we2"];
					ext += "; "+P.name+" 提升了 "+ P.op["tp1"] +" 点体力";
					if(S.op["we2"]!=undefined&&S.op["we2"]>0) ext += "，并提升了 "+ S.op["we2"] +" 点权重";
					if(S.op["hi"]!=undefined&&S.op["hi"]==2){
						ext += "; "+S.name+"["+S.role.name+"] 失去了血盾";
					}
					break;
				}
				case 9:{//上限达到峰值
					res += P.name+" 恢复了";
					ext += "体力上限+"+tp1;
					ext += "，体力已达峰值";
					break;
				}
				case 10:{//上限增加
					res += P.name+" 恢复了";
					ext += "体力上限+"+tp1;
					break;
				}
				case 11:{//强化（上限达到峰值）
					res += P.name+" 进行了强化";
					ext += "攻击+"+ak1;
					ext += "，体力已达峰值";
					break;
				}
				case 12:{//加权
					res += P.name+" 进行了加权";
					ext += "权重+"+we1;
					break;
				}
				case 13:{//死亡
					res += P.name+" 阵亡！";
					break;
				}
				case 14:{//置后
					res += P.name+" 选择了置后";
					break;
				}
				case 101:{//启动护盾
					res += P.name+" 启动了护盾";
					break;
				}
				case 103:{//攻击并破坏目标护盾
					res += P.name+" 选择了攻击 "+S.name+"["+S.role.name+"]";
					ext += S.name+"["+S.role.name+"] 的护盾被破坏了";
					break;
				}
				case 104:{//牺牲
					res += P.name+" 使用了牺牲<br/>";
					ext += P.name+" 交换了自己的体力值("+P.cp+")和攻击力("+P.ak+")";
					break;
				}
				case 105:{//蓄能
					res += P.name+" 蓄积了能量";
					ext += "能量值增加了 1 点";
					break;
				}
				case 107:{//绑定
					res += P.name+" 绑定了 "+S.name+"["+S.role.name+"]";
					break;
				}
				case 109:{//解除绑定
					res += P.name+" 解除了绑定";
					break;
				}
				case 110:{//启动血盾
					res += P.name+" 为 "+S.name+"["+S.role.name+"] 施加了血盾("+P.op["hi1"]+")";
					break;
				}
				default:{
					res = "【程序错误002】<br/>";
					break;
				}
			}
			if(ext.length>0) res = res + "&nbsp;(" + ext + ")";
			
			return res;
		}
		
		//清理界面
		function clear(){
			if(model==1){
				$("._team_block_out").remove();
			}
			else if(model==0){
				$("#mainWin").remove();
			}
		}
		
		//获得队伍中的存活玩家数
		function getTeamAliveNum(id){
			var res = 0;
			for(var i=0;i<players.length;i++){
				if((players[i].team==id)&&(players[i].alive)) res += 1;
			}
			return res;
		}
		
		//获得阵营数组: -1 - 混乱模式
		function getTeams(){
			var res = new Array();
			for(var i=0;i<players.length;i++){
				var P = players[i];
				if(P.team!=-1){//阵营模式
					var isIn = false;//当前玩家的team已存在于teams中
					for(var j=0;j<res.length;j++){
						if(P.team==res[j].id){
							isIn = true;
							res[j].add(P);
							break;
						}
					}
					if(!isIn){
						var T = new Team(P.team,"TEAM"+P.team,P.color);
						T.add(P);
						res.push(T);
					}
				}
				else{//混乱模式
					res = -1;
					break;
				}
			}
			return res;
		}
		
		//判断唯一队伍存活(是-返回该队 | 否-返回-1)
		function teamWin(){
			var res = -1;
			var aliveTeamNo = 0;
			var temp;
			for(var i=0;i<teams.length;i++){
				if(getTeamAliveNum(teams[i].id)>0){
					aliveTeamNo++;
					temp = teams[i];
				}
			}
			if(aliveTeamNo==1){
				res = temp;
			}
			return res;
		}
		
		//判断唯一玩家存活(是-返回该玩家 | 否-返回-1)
		function playerWin(){
			var res = -1;
			var alivePlayerNo = 0;
			var temp;
			for(var i=0;i<players.length;i++){
				if(players[i].alive){
					alivePlayerNo++;
					temp = players[i];
				}
			}
			if(alivePlayerNo==1){
				res = temp;
			}
			return res;
		}
		
		//获得存活玩家数
		function getAliveNum(){
			var res = 0;
			for(var i=0;i<players.length;i++){
				if(players[i].alive) res += 1;
			}
			return res;
		}
		
		//获得随机数
		function getRandom(s,e){
			var res = 0;
			res = parseInt((Math.random()*e))+s;
			return res;
		}
		
		//通过队伍ID获得队伍名称
		function getTeamNameByID(id){
			var res = "NOT FOUND";
			for(var i=0;i<teams.length;i++){
				if(teams[i].id==id){
					res = teams[i].name;
					break;
				}
			}
			return res;
		}
		
		//显示玩家详细信息
		function dispDetail(id){
			var P = all.getByID(id);
			if(id==0){
				var win = dpanel2.children().eq(1);
				win.text("");
			}
			else if(P!=false){
				var win = dpanel2.children().eq(1);
				win.text("");
				var txt = "";
				txt += "<div id=\"panel_2_img\"><img src=\""+P.role.icon+"\" width=\"100%\" height=\"100%\"/></div>";
				txt += "<div id=\"panel_2_detail\">";
				txt += "<div id=\"panel_2_name\">"+P.name+"["+P.role.name+"]:</div>";
				if(model==1) txt += "<div>阵营："+getTeamNameByID(P.team)+"</div>";
				txt += "<div>体力："+P.cp+"/"+P.tp+"</div>";
				txt += "<div>攻击力："+P.ak+"</div>";
				txt += "<div>权重："+P.weight+"</div>";
				txt += "<div>杀人数："+P.kill+"</div>";
				txt += "<div>存活："+(P.alive?"是":"否")+"</div>";
				txt += "<div>电脑："+(P.isComputer?"是":"否")+"</div>";
				txt += "<div>行动者："+(P.isActor?"是":"否")+"</div>";
				txt += "<div>状态：";
				for(var i=0;i<P.buffSet.buffs.length;i++){
					txt += P.buffSet.buffs[i].desc;
					if(P.buffSet.buffs[i].accumulate){
						txt += "("+P.buffSet.buffs[i].level+")";
					}
					if((i+1)!=P.buffSet.buffs.length)txt += ",";
				}
				if(P.buffSet.buffs.length==0) txt += "-";
				txt += "</div>";
				txt += "</div>";
				txt += "<div class=\"_clear\"></div>";
				win.append(txt);
			}
			return P;
		}
		
		//显示玩家操作选项
		function dispOperation(id){
			var P = all.getByID(id);
			var win = dpanel3.children().eq(1);
			if(id==0||!play||cs!=1||action["selfUp"]){
				win.text("");
			}
			else if(P!=false&&!P.isComputer&&action["actor"].id==P.id){
				win.text("");
				var osArray = new Array();//(string)技能按钮ID列表
				var txt = "";
				txt += "<div id=\"panel_3_2_1\">基本操作：";
				txt += "<div>";
				txt += "<button class=\"_btn5\" title=\"恢复 [攻击力] 点体力值\n-如果体力值满则增加 [攻击力] 点体力上限\n-快捷键[R]\" id=\"o1\" value=\""+P.id+"\">恢复</button>";
				txt += "<button class=\"_btn5\" title=\"增加 1 点攻击力\n-如果体力值满则增加 1 点体力和上限\n-快捷键[S]\" id=\"o2\" value=\""+P.id+"\">强化</button>";
				if(round!=1) txt += "<button class=\"_btn5\" title=\"对目标玩家造成 [攻击力] 的伤害\n-快捷键[A]\" id=\"o3\" value=\""+P.id+"\">攻击</button>";
				txt += "<button class=\"_btn5\" title=\"增加 1 点权重\n-权重为你的玩家份额数";
				txt += "\n-系统将随机从所有玩家份额数中挑选玩家作为每回合的行动者";
				txt += "\n-权重越高，成为行动者的可能性越大\n-快捷键[W]\" id=\"o4\" value=\""+P.id+"\">加权</button>";
				txt += "<br/>&nbsp;<div class=\"_clear\"></div>";
				txt += "</div>";
				txt += "</div>";
				txt += "<div id=\"panel_3_2_2\">技能：<br/>";
				var skills = P.role.skillSet.skills;//(Skill)技能列表
				for(var i=0;i<skills.length;i++){
					//一次性技能未被使用过 and 第一回合时不是绑定
					if(!skills[i].used)
					{
						if(!skills[i].passive){//非被动技能
							txt += "<button class=\"_btn5\" title=\""+skills[i].desc2+"\" id=\"os"+
									skills[i].type+"\" value=\""+skills[i].type+"\">";
							txt += skills[i].desc;
							txt +="</button>";
							osArray.push("os"+skills[i].type);
						}
						else{//被动技能
							txt += "<button class=\"_btn6\" disabled=\"disabled\" title=\""+skills[i].desc2+"\">";
							txt += skills[i].desc;
							txt +="</button>";
							osArray.push("os"+skills[i].type);
						}
					}
				}
				if(skills.length==0){
					txt += "&nbsp;";
				}
				txt += "</div>";
				txt += "<div class=\"_clear\"></div>";
				txt += "<div id=\"panel_3_2_3\">特殊操作：<br/>";
				if(canLate) txt += "<button class=\"_btn5\" title=\"将自己的行动推迟到本回合最后一个\n-每回合只能使用一次\n-快捷键[L]\" id=\"o5\" value=\""+P.id+"\">置后</button>";
				else txt += "&nbsp;";
				txt += "</div>";
				txt += "<div id=\"oAction\">&nbsp;";
				txt += "<div class=\"_el17\">&nbsp;动作：</div>";
				txt += "<div class=\"_el18\">"+(action["desc"]!=undefined?action["desc"]:"&nbsp;")+"</div>";
				txt += "</div>";
				win.append(txt);
				$("#o1").unbind("click");
				$("#o2").unbind("click");
				$("#o3").unbind("click");
				$("#o4").unbind("click");
				$("#o1").bind("click",function(){
					var C = checkO1();
					cursor = 0;
					if(C.length==0){
						action["action"] = "r";
						action["desc"] = "恢复";
					}
					else{
						action["action"] = undefined;
						action["desc"] = "【无法执行】"+C+"<br/>";
						log(action["desc"]);
					}
					$("#oAction").children().eq(1).text("");
					$("#oAction").children().eq(1).append(action["desc"]);
				});
				$("#o2").bind("click",function(){
					cursor = 0;
					action["action"] = "s";
					action["desc"] = "强化";
					$("#oAction").children().eq(1).text("");
					$("#oAction").children().eq(1).append(action["desc"]);
				});
				$("#o3").bind("click",function(){
					var C = checkO3();
					action["action"] = undefined;
					if(C.length==0){
						cursor = 1;
						action["desc"] = "[请选择攻击目标...]";
					}
					else{
						action["desc"] = "【无法执行】"+C+"<br/>";
						log(action["desc"]);
					}
					$("#oAction").children().eq(1).text("");
					$("#oAction").children().eq(1).append(action["desc"]);
				});
				$("#o4").bind("click",function(){
					cursor = 0;
					action["action"] = "w";
					action["desc"] = "加权";
					$("#oAction").children().eq(1).text("");
					$("#oAction").children().eq(1).append(action["desc"]);
				});
				$("#o5").bind("click",function(){
					cursor = 0;
					action["action"] = "l";
					action["desc"] = "置后";
					$("#oAction").children().eq(1).text("");
					$("#oAction").children().eq(1).append(action["desc"]);
				});
				for(var i=0;i<osArray.length;i++){
					var bt = $("#"+osArray[i]);
					bt.unbind("click");
					bt.bind("click",function(){
						var type = parseInt($(this).attr("value"));
						switch(type){
							case 1:{//护盾
								cursor = 0;
								if(action["actor"].buffSet.getByType(1)==false){//如果护盾未开启
									action["action"] = "shield";
									action["desc"] = "启动护盾";
								}
								else{
									action["action"] = undefined;
									action["desc"] = "【无法执行】护盾已开启<br/>";
									log(action["desc"]);
								}
								$("#oAction").children().eq(1).text("");
								$("#oAction").children().eq(1).append(action["desc"]);
								break;
							}
							case 3:{//牺牲
								cursor = 0;
								var aliveFriendNo = 0;//存活队友数
								for(var i=0;i<players.length;i++){
									if(players[i].team==action["actor"].team&&players[i].alive&&players[i].id!=action["actor"].id){
										aliveFriendNo ++;
									}
								}
								if(model==0) aliveFriendNo=0;
								if(aliveFriendNo>0){//如果条件不允许
									action["action"] = undefined;
									action["desc"] = "【无法执行】未达到条件<br/>";
									log(action["desc"]);
								}
								else if(action["actor"].ak<=0){//没有攻击力
									action["action"] = undefined;
									action["desc"] = "【无法执行】你的攻击力为零，无法使用该能力<br/>";
									log(action["desc"]);
								}
								else{
									action["action"] = "sacrifice";
									action["desc"] = "牺牲";
								}
								$("#oAction").children().eq(1).text("");
								$("#oAction").children().eq(1).append(action["desc"]);
								break;
							}
							case 4:{//绑定
								var C = checkBind();
								action["action"] = undefined;
								if(C.length==0){
									cursor = 2;
									action["desc"] = "[请选择绑定目标...]";
								}
								else{
									action["desc"] = "【无法执行】"+C+"<br/>";
									log(action["desc"]);
								}
								$("#oAction").children().eq(1).text("");
								$("#oAction").children().eq(1).append(action["desc"]);
								break;
							}
							case 5:{//蓄能
								cursor = 0;
								action["action"] = "fire";
								action["desc"] = "蓄能";
								$("#oAction").children().eq(1).text("");
								$("#oAction").children().eq(1).append(action["desc"]);
								break;
							}
							case 9:{//血盾
								var C = checkBloodShield();
								action["action"] = undefined;
								if(C.length==0){
									cursor = 3;
									action["desc"] = "[请选择施加血盾的目标...]";
								}
								else{
									action["desc"] = "【无法执行】"+C+"<br/>";
									log(action["desc"]);
								}
								$("#oAction").children().eq(1).text("");
								$("#oAction").children().eq(1).append(action["desc"]);
								break;
							}
							default :{
								log("【程序错误006】<br/>");
								break;
							}
						}
					});
				}
			}
			else if(P.isComputer||action["actor"].id!=P.id){
				win.text("");
			}
			return P;
		}
		
		//选中攻击目标
		function getAkObj(id){
			var P = all.getByID(id);
			if(!P.alive){
				log("不能攻击死者<br/>");
			}
			else if(P.id==action["actor"].id){
				log("不能攻击自己<br/>");
			}
			else if(model==1&&action["actor"].team==P.team){
				log("不能攻击队友<br/>");
			}
			else if(P.isActor){
				log("不能攻击行动者<br/>");
			}
			else{
				cursor = 0;
				action["action"] = "a";
				action["object"] = P;
				$("#oAction").children().eq(1).text("");
				$("#oAction").children().eq(1).append("攻击玩家: "+P.name+"!");
			}
		}
		
		//选中绑定目标
		function getBindObj(id){
			var P = all.getByID(id);
			if(!P.alive){
				log("不能绑定死者<br/>");
			}
			else if(P.id==action["actor"].id){
				log("不能绑定自己<br/>");
			}
			else if(model==1&&action["actor"].team==P.team){
				log("不能绑定队友<br/>");
			}
			else if(P.isActor){
				log("不能绑定行动者<br/>");
			}
			else if(P.isBound){
				log("不能绑定已被绑定的玩家<br/>");
			}
			else{
				cursor = 0;
				action["action"] = "bind";
				action["object2"] = P;
				$("#oAction").children().eq(1).text("");
				$("#oAction").children().eq(1).append("绑定玩家: "+P.name);
			}
		}
		
		//选中血盾施加目标
		function getBloodShieldObj(id){
			var P = all.getByID(id);
			if(!P.alive){
				log("不能施加给死者<br/>");
			}
			else if(relationship(action["actor"],P)==0){
				log("不能施加给敌人<br/>");
			}
			else if(P.buffSet.getByType(5)!=false&&P.buffSet.getByType(5).level>=action["actor"].ak){
				log("该玩家已经有足够的血盾值<br/>");
			}
			else{
				cursor = 0;
				action["action"] = "bloodshield";
				action["object3"] = P;
				$("#oAction").children().eq(1).text("");
				$("#oAction").children().eq(1).append("给玩家: "+P.name+" 施加血盾");
			}
		}
		
		//检查恢复按钮: ""-正常 | 错误字符串-不正常
		function checkO1(){
			var res = "";
			var P = action["actor"];
			
			if(P.ak<=0) res = "你没有攻击力";
			else if(P.tp>=maxHP&&P.cp>=P.tp) res = "体力上限已达峰值";
			else if(P.buffSet.getByType(2)!=false&&P.cp>=P.tp) res = "你已使用了【牺牲】，无法提高上限";
			
			return res;
		}

		//检查攻击按钮: ""-正常 | 错误字符串-不正常
		function checkO3(){
			var res = "";
			var P = action["actor"];
			
			if(P.ak<=0) res = "你没有攻击力";
			else if(model==1){
				var t = 0;
				for(var i=0;i<players.length;i++){
					if(players[i].alive&&
						!players[i].isActor&&
						players[i].team!=P.team){
						t++;
					}
				}
				if(t==0) res= "没有可攻击的目标";
			}
			else if(model==0){
				var t = 0;
				for(var i=0;i<players.length;i++){
					if(players[i].alive&&!players[i].isActor){
						t++;
					}
				}
				if(t==0) res= "没有可攻击的目标";
			}
			
			return res;
		}
		
		//检查绑定按钮: ""-正常 | 错误字符串-不正常
		function checkBind(){
			var res = "";
			var P = action["actor"];
			
			if(model==1){
				var t = 0;
				for(var i=0;i<players.length;i++){
					if(players[i].alive&&
						!players[i].isActor&&
						players[i].team!=P.team&&
						!players[i].isBound){
						t++;
					}
				}
				if(t==0) res= "没有可绑定的目标";
			}
			else if(model==0){
				var t = 0;
				for(var i=0;i<players.length;i++){
					if(players[i].alive&&!players[i].isActor&&!players[i].isBound){
						t++;
					}
				}
				if(t==0) res= "没有可绑定的目标";
			}
			
			return res;
		}
		
		//检查血盾按钮: ""-正常 | 错误字符串-不正常
		function checkBloodShield(){
			var res = "";
			var P = action["actor"];
			
			var t = 0;
			for(var i=0;i<players.length;i++){
				//活着，并且是队友或自己
				if(players[i].alive&&relationship(P,players[i])!=0){
					if(players[i].buffSet.getByType(5)==false){//如果没有血盾
						t++;
					}
					else if(players[i].buffSet.getByType(5)!=false
							&&players[i].buffSet.getByType(5).level<P.ak){//如果有血盾，但血盾值低于actor的攻击力
						t++
					}
				}
			}
			if(t==0) res= "没有可施加的目标";
			
			return res;
		}
		
		//判断2个玩家的关系
		/*
			0：敌人 | 1：自己 | 2：队友
		*/
		function relationship(P1,P2){
			res = 0;
			if(P1.id==P2.id){
				res = 1;
			}
			else if(model==1&&(P1.team==P2.team)){
				res = 2;
			}
			return res;
		}
		
		//游戏结束
		function victory(){
			play = false;
			dpanel3.remove();
			dpanel5.remove();
			dpanel2.css("height","100%");
			dpanel1.css("height","32%");
			dpanel4.css("height","66%");
			cursor = 0;
			disp();
			log("游戏结束;)<br/>");
		}	

		//显示全部信息
		function disp(){
			clear();//清除全部信息
			
			aliveNum = getAliveNum();//存货玩家数
			dinfo2.text(dinfo2pfx+actors.players.length);
			dinfo3.text(dinfo3pfx+nextActorNo);
			dinfo4.text(dinfo4pfx+round);
			dinfo5.text(dinfo5pfx+aliveNum);
			
			//显示window(阵营模式)
			if(model==1)
			{
				var cssh = parseInt((1/teams.length)*96);
				for(var i=0;i<teams.length;i++){
					var txt = "";
					txt += "<div class=\"_team_block_out\" id=\"team"+teams[i].id+"\">";
					txt += "<div class=\"_team_block_in\" value=\""+teams[i].id+"\">";
					txt += "<div><div>"+teams[i].name+"</div></div>";
					//显示玩家
					for(var j=0;j<players.length;j++){
						if(players[j].team==teams[i].id&&players[j].alive){//显示一个生存玩家
							var ctp = parseInt((players[j].cp/players[j].tp)*100);//体力值比例
							//形象槽
							txt += "<div class=\"_player_block\" id=\"P"+players[j].id
										+"\" value=\""+players[j].id+"\" draggable=\"true\">";
							txt += "<div class=\"_player_block_sub1\" value=\""+players[j].id+"\">";
							txt += "<div class=\"_player_block_sub1_1\"><img src="
										+players[j].role.icon+" width=\"96%\" height=\"110%\"></div>";
							txt += "<div class=\"_player_block_sub1_2\">"+players[j].name;
							if(!play&&(players[j].team==teamWinner.id)) txt += "<br/>(胜利者)";
							else if(players[j].isActor){
								if(teams.length<5) txt += "<br/>(行动者"+players[j].actionNo+")";
								else txt += "<br/>(行 "+players[j].actionNo+" )";
							}
							txt += "</div></div>";
							//血槽
							txt += "<div class=\"_player_block_sub2\" title=\"体力:"+players[j].cp+"/"+players[j].tp+"\">";
							if(ctp>0){
								txt += "<div class=\"_player_block_sub2_1\" style=\"width:"+ctp+"%\">";
								if(ctp<=50) txt += "<brown>";
							}
							else{
								txt += "<div class=\"_player_block_sub2_1\" style=\"width:0%\">";
								if(ctp<=50) txt += "<red>";
							}
							txt += players[j].cp+"/"+players[j].tp+"</div>";
							txt += "</div>";
							//属性槽
							txt += "<div class=\"_player_block_sub3\">";
							txt += "<div class=\"_player_block_sub3_1\" title=\"攻击力:"+players[j].ak+"\">"+
									"<img src=\"img/icon/sword.png\" width=\"25%\" height=\"100%\"/>x"+players[j].ak+"</div>";
							txt += "<div class=\"_player_block_sub3_2\" title=\"权重:"+players[j].weight+"\">"+
									"<img src=\"img/icon/balance.png\" width=\"25%\" height=\"100%\"/>x"+players[j].weight+"</div>";
							txt += "</div>";
							
							//状态槽
							txt += "<div class=\"_player_block_sub4\">";
							var buffSet = players[j].buffSet;
							for(var k=0;k<buffSet.buffs.length;k++){
								if(buffSet.buffs[k].accumulate&&buffSet.buffs[k].level>0){//如果是积累buff
									txt += "<div class=\"_el20\" title=\""+buffSet.buffs[k].desc+"(累积 "+buffSet.buffs[k].level+" )\">";
									txt += "<img src=\""+buffSet.buffs[k].icon+"\" width=\"70%\" height=\"90%\"/>";
									if(teams.length<6){
										if(buffSet.buffs[k].level<10) txt += buffSet.buffs[k].level;
										else txt += "+";
									}
								}
								else{
									txt += "<div class=\"_el20\" title=\""+buffSet.buffs[k].desc+"\">";
									txt += "<img src=\""+buffSet.buffs[k].icon+"\" width=\"100%\" height=\"100%\"/>";
								}
								txt += "</div>";
							}
							txt += "</div>";
							
							txt += "</div>";
						}
						else if(players[j].team==teams[i].id&&!players[j].alive){//显示一个死亡玩家
							txt += "<div class=\"_player_block\" id=\"P"+players[j].id
										+"\" value=\""+players[j].id+"\" draggable=\"true\">";
							txt += "<div class=\"_player_block_sub1\" value=\""+players[j].id+"\">";
							txt += "<div class=\"_player_block_sub1_1\">";
							txt += "<img src=\"img/texture/coord.png\" width=\"88%\" height=\"100%\">";
							txt += "</div>";
							txt += "<div class=\"_player_block_sub1_2\">"+players[j].name;
							if(!play&&(players[j].team==teamWinner.id)) txt += "<br/>(烈士)</div></div>";
							else txt += "</div></div>";
							txt += "<div class=\"_player_block_sub2\" title=\"-\">-";
							txt += "</div>";
							txt += "</div>";
						}
					}
					txt += "<div class=\"_clear\"></div>";
					txt += "</div>";
					txt += "</div>";
					
					dwindow.append(txt);
					$("#team"+teams[i].id).children().eq(0).css("border","solid 2px "+teams[i].color);
					$("#team"+teams[i].id).css("height",cssh+"%");
					$("#team"+teams[i].id).children().eq(0).children().eq(0).css("width","10%");
					$("#team"+teams[i].id).children().eq(0).children().eq(0).css("height","100%");
					$("#team"+teams[i].id).children().eq(0).children().eq(0).css("float","left");
					$("#team"+teams[i].id).children().eq(0).children().eq(0).children().eq(0).css("background",teams[i].color);
					$("#team"+teams[i].id).children().eq(0).children().eq(0).children().eq(0).css("border-bottom-right-radius","30px");
					//设置该队伍每个player block
					for(var j=1;j<teams[i].players.length+1;j++){
						var PB = $("#team"+teams[i].id).children().eq(0).children().eq(j);
						var PID = PB.attr("value");
						PB.css("border","solid 4px "+teams[i].color);
						PB.children().eq(0).css("background",teams[i].color);
						PB.children().eq(0).css("border","solid 3px "+teams[i].color);
						if(action["actor"]!=undefined&&PID==action["actor"].id) PB.css("border","outset 4px #F4243B");
						if(all.getByID(PID).isActor){
							PB.css("background","#FA68D8");
						}
					}
				}
				//绑定每个player block按钮的动作
				$("._player_block_sub1").bind("click",function(){
					var PID = $(this).attr("value");
					selectedPlayer = PID;
					switch(cursor){
						case 0:{
							dispDetail(PID);
							dispOperation(PID);
							break;
						}
						case 1:{
							getAkObj(PID);
							break;
						}
						case 2:{
							getBindObj(PID);
							break;
						}
						case 3:{
							getBloodShieldObj(PID);
							break;
						}
					}
				});
			}
			//显示window(混乱模式)
			if(model==0)
			{
				var txt = "";
				txt += "<div id=\"mainWin\">";
				txt += "<div id=\"mainWin2\">";
				txt += "</div></div>";
				dwindow.append(txt);
				//显示玩家
				for(var i=0;i<players.length;i++){
					txt = "";
					if(players[i].alive){//显示一个生存玩家
						var ctp = parseInt((players[i].cp/players[i].tp)*100);//体力值比例
						
						//形象槽
						txt += "<div class=\"_player_block\" id=\"P"+players[i].id
									+"\" value=\""+players[i].id+"\" draggable=\"true\">";
						txt += "<div class=\"_player_block_sub1\" value=\""+players[i].id+"\">";
						txt += "<div class=\"_player_block_sub1_1\"><img src="
									+players[i].role.icon+" width=\"96%\" height=\"110%\"></div>";
						txt += "<div class=\"_player_block_sub1_2\">"+players[i].name;
						if(players[i].id==playerWinner.id) txt += "<br/>(胜利者)";
						else if(players[i].isActor) txt += "<br/>(行动者"+players[i].actionNo+")";
						txt += "</div></div>";
						
						//血槽
						txt += "<div class=\"_player_block_sub2\" title=\"体力:"+players[i].cp+"/"+players[i].tp+"\">";
						if(ctp>0){
							txt += "<div class=\"_player_block_sub2_1\" style=\"width:"+ctp+"%\">";
							if(ctp<=50) txt += "<brown>";
						}
						else{
							txt += "<div class=\"_player_block_sub2_1\" style=\"width:0%\">";
							if(ctp<=50) txt += "<red>";
						}
						txt += players[i].cp+"/"+players[i].tp+"</div>";
						txt += "</div>";
						
						//属性槽
						txt += "<div class=\"_player_block_sub3\">";
						txt += "<div class=\"_player_block_sub3_1\" title=\"攻击力:"+players[i].ak+"\">"+
								"<img src=\"img/icon/sword.png\" width=\"25%\" height=\"100%\">x"+players[i].ak+"</div>";
						txt += "<div class=\"_player_block_sub3_2\" title=\"权重:"+players[i].weight+"\">"+
								"<img src=\"img/icon/balance.png\" width=\"25%\" height=\"100%\">x"+players[i].weight+"</div>";
						txt += "</div>";
						
						//状态槽
						txt += "<div class=\"_player_block_sub4\">";
						var buffSet = players[i].buffSet;
						for(var k=0;k<buffSet.buffs.length;k++){
							if(buffSet.buffs[k].accumulate&&buffSet.buffs[k].level>0){//如果是积累buff
								txt += "<div class=\"_el20\" title=\""+buffSet.buffs[k].desc+"(累积 "+buffSet.buffs[k].level+" )\">";
								txt += "<img src=\""+buffSet.buffs[k].icon+"\" width=\"70%\" height=\"90%\"/>";
								if(buffSet.buffs[k].level<10) txt += buffSet.buffs[k].level;
								else txt += "+";
							}
							else{
								txt += "<div class=\"_el20\" title=\""+buffSet.buffs[k].desc+"\">";
								txt += "<img src=\""+buffSet.buffs[k].icon+"\" width=\"100%\" height=\"100%\"/>";
							}
							txt += "</div>";
						}
						txt += "</div>";
						
						txt += "</div>";
					}
					else{//显示一个死亡玩家
						txt += "<div class=\"_player_block\" id=\"P"+players[i].id
									+"\" value=\""+players[i].id+"\" draggable=\"true\">";
						txt += "<div class=\"_player_block_sub1\" value=\""+players[i].id+"\">";
						txt += "<div class=\"_player_block_sub1_1\">";
						txt += "<img src=\"img/texture/coord.png\" width=\"88%\" height=\"100%\">";
						txt += "</div>";
						txt += "<div class=\"_player_block_sub1_2\">"+players[i].name+"</div></div>";
						txt += "<div class=\"_player_block_sub2\" title=\"-\">-";
						txt += "</div>";
						txt += "</div>";
					}
					$("#mainWin2").append(txt);
					
					var PB = $("#P"+players[i].id);
					PB.css("margin","5px");
					PB.css("border","solid 4px #777");
					PB.css("background","#FFF");
					PB.css("border-bottom-right-radius","30px");
					PB.children().eq(0).css("background","#FFF");
					PB.children().eq(0).css("border","solid 3px #FFF");
					if(action["actor"]!=undefined&&players[i].id==action["actor"].id) PB.css("border","outset 4px #F4243B");
					if(players[i].isActor){
						PB.css("background","#FA68D8");
					}
				}
				
				//绑定每个player block按钮的动作
				$("._player_block_sub1").bind("click",function(){
					var PID = $(this).attr("value");
					selectedPlayer = PID;
					switch(cursor){
						case 0:{
							dispDetail(PID);
							dispOperation(PID);
							break;
						}
						case 1:{
							getAkObj(PID);
							break;
						}
						case 2:{
							getBindObj(PID);
							break;
						}
						case 3:{
							getBloodShieldObj(PID);
							break;
						}
					}
				});
			}
			if(teams.length==5){
				$("._player_block").css("width","13%");
				$("._player_block").css("height","96px");
			}
			else if(teams.length==6){
				$("._player_block").css("width","13%");
				$("._player_block").css("height","79px");
			}
		}
		
		return res;
	}
	




















}