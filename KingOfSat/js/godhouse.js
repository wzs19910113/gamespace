function Configer(all)
{
	//------------属性------------
	this.all = new Team();
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
		var test = 1;
		//------------声明变量------------
		var all = this.all;
		var players = this.all.players;
		var dwindow = this.dwindow;
		var dpanel1 = this.dpanel1;
		var dpanel2 = this.dpanel2;
		var dpanel3 = this.dpanel3;
		var dpanel4 = this.dpanel4;
		var dpanel5 = this.dpanel5;
		
		var all = this.all;
		
		var teams = getTeams();//阵营数组
		var aliveNum = getAliveNum();//存活玩家数量
		var model = (teams==-1?0:1);//模式: 0-竞技场 | 1-荣誉
		
		//------------显示-----------
		
		disp();
		
		//按下【开始游戏】按扭
		dpanel5.children().eq(0).bind("click",function(){
			finish();
		});
		
		//完成
		function finish(){
			var writeData = all.toJSON();
			log("数据生成中...",1);
			$.post(
				"operation.php",
				{
					"W":writeData,
					"F":readFile
				},
				function(res){
					if(res=="1"){
						log("数据生成成功!",1);
						location = "J.html";
					}
					else {
						log("【无法执行】数据生成失败",1);
						log(res,1);
					}
				}
			)
		}
		
		//获得存活玩家数
		function getAliveNum(){
			var res = 0;
			for(var i=0;i<players.length;i++){
				if(players[i].alive) res += 1;
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
		
		//添加游戏记录
		function log(txt,line){
			dpanel4.append("-->"+txt);
			if(line) dpanel4.append("<br/>");
			dpanel4.scrollTop(dpanel4[0].scrollHeight);
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
						txt += "("+P.buffSet.buffs[i].level+"级)";
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
			win.text("");
			var txt = "";
			
			//体力
			txt += "<div class=\"_el18\">";
			txt += "<div class=\"_el21\">体力: </div>";
			txt += "<input class=\"_input1\" id=\"attr1\" type=\"number\" min=\"1\" max=\""+maxHP+"\" value=\""+P.cp+"\"/>";
			txt += "</div>";
			
			//体力上限
			txt += "<div class=\"_el18\">";
			txt += "<div class=\"_el21\">体力上限: </div>";
			txt += "<input class=\"_input1\" id=\"attr2\" type=\"number\" min=\"1\" max=\""+maxHP+"\" value=\""+P.tp+"\"/>";
			txt += "</div>";
			
			//攻击力
			txt += "<div class=\"_el18\">";
			txt += "<div class=\"_el21\">攻击力: </div>";
			txt += "<input class=\"_input1\" id=\"attr3\" type=\"number\" min=\"0\" max=\"9999\" value=\""+P.ak+"\"/>";
			txt += "</div>";
			
			//权重
			txt += "<div class=\"_el18\">";
			txt += "<div class=\"_el21\">权重: </div>";
			txt += "<input class=\"_input1\" id=\"attr4\" type=\"number\" min=\"1\" max=\"9999\" value=\""+P.weight+"\"/>";
			txt += "</div>";
			
			txt += "<div class=\"_clear\"></div>";
			
			txt += "<div class=\"_el18\"><button class=\"_btn8\" id=\"submit1\" value=\""+P.id+"\">修改属性</button></div>";
			
			win.append(txt);
			
			$("#submit1").bind("click",function(){
				var PID = $(this).attr("value");
				var P = all.getByID(PID);
				var ncp = parseInt($("#attr1").attr("value"));//新的体力
				var ntp = parseInt($("#attr2").attr("value"));//新的体力上限
				var nak = parseInt($("#attr3").attr("value"));//新的攻击力
				var nwe = parseInt($("#attr4").attr("value"));//新的权重
				var ncpmin = parseInt($("#attr1").attr("min"));//体力最小值
				var ncpmax = parseInt($("#attr1").attr("max"));//体力最大值
				var ntpmin = parseInt($("#attr2").attr("min"));//体力上限最小值
				var ntpmax = parseInt($("#attr2").attr("max"));//体力上限最大值
				var nakmin = parseInt($("#attr3").attr("min"));//攻击力最小值
				var nakmax = parseInt($("#attr3").attr("max"));//攻击力最大值
				var nwemin = parseInt($("#attr4").attr("min"));//权重最小值
				var nwemax = parseInt($("#attr4").attr("max"));//权重最大值
				if(ncp<ncpmin){
					log("【无法执行】体力值太小",1);
				}
				else if(ncp>ntp){
					log("【无法执行】体力值不能大于体力上限",1);
				}
				else if(ntp<ntpmin){
					log("【无法执行】体力上限太小",1);
				}
				else if(ntp>ntpmax){
					log("【无法执行】体力上限不能大于 "+ntpmax,1);
				}
				else if(nak<nakmin){
					log("【无法执行】攻击力太小",1);
				}
				else if(nak>nakmax){
					log("【无法执行】攻击力不能大于 "+nakmax,1);
				}
				else if(nwe<nwemin){
					log("【无法执行】权重太小",1);
				}
				else if(nwe>nwemax){
					log("【无法执行】权重不能大于 "+nwemax,1);
				}
				else{
					P.cp = ncp;
					P.tp = ntp;
					P.ak = nak;
					P.weight = nwe;
					log(P.name+"["+P.role.name+"] 的属性已被修改",1);
				}
				disp();
				dispDetail(P.id);
				
			});
			return P;
		}
		
		//显示全部信息
		function disp(){
			clear();//清除全部信息
			
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
							txt += "<div class=\"_player_block_sub4\">-";
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
					}
				}
				//绑定每个player block按钮的动作
				$("._player_block_sub1").bind("click",function(){
					var PID = $(this).attr("value");
					dispDetail(PID);
					dispOperation(PID);
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
						txt += "<div class=\"_player_block_sub4\">-";
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
				}
				
				//绑定每个player block按钮的动作
				$("._player_block_sub1").bind("click",function(){
					var PID = $(this).attr("value");
					dispDetail(PID);
					dispOperation(PID);
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