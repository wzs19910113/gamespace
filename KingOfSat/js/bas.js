//体力最大值
var maxHP = 999;
//最大玩家数
var maxPlayerNum = 20;
//传输文件名
var readFile = "temp";
//随机选角的范围
var firstRandom = 3;

//角色
function Role(name,itp,icp,iak,weight,icon)
{
	//子类
	this.type = 0;
	this.name = "none";
	this.icon = "none";
	this.itp = this.icp = this.iak = this.weight = -1;
	this.spec = 0;//特殊角色
	this.desc = "";//描述
	this.skillSet = new SkillSet();//技能集
	if(name) this.name = name;
	if(itp) this.itp = itp;
	if(icp) this.icp = icp;
	if(iak) this.iak = iak;
	if(weight) this.weight = weight;
	if(icon) this.icon = icon;
}
//各种角色
function A()
{
	this.type = 1;
	this.name = "僵尸";
	this.itp = 3;
	this.icp = 3;
	this.iak = 2;
	this.weight = 3;
	this.desc = "拥有【吸血】和【蓄能】";
	//蓄能，吸血
	this.skillSet = new SkillSet();
	this.skillSet.add(new S5());
	this.skillSet.add(new S6());
}; A.prototype = new Role();
function B()
{
	this.type = 2;
	this.name = "侦察兵";
	this.itp = 4;
	this.icp = 4;
	this.iak = 1;
	this.weight = 3;
	this.desc = "拥有【绑定】";
	//绑定
	this.skillSet = new SkillSet();
	this.skillSet.add(new S4());
}; B.prototype = new Role();
function C()
{
	this.type = 3;
	this.name = "天使";
	this.itp = 6;
	this.icp = 6;
	this.iak = 0;
	this.weight = 3;
	this.desc = "拥有【护盾】，【自愈】和【牺牲】";
	//护盾，自愈，牺牲
	this.skillSet = new SkillSet();
	this.skillSet.add(new S1());
	this.skillSet.add(new S3());
	this.skillSet.add(new S2());
}; C.prototype = new Role();
function D()
{
	this.type = 4;
	this.name = "恶魔";
	this.itp = 6;
	this.icp = 6;
	this.iak = 2;
	this.weight = 2;
	this.desc = "拥有【吸血】和【无敌】";
	this.spec = 1;//特殊角色
	this.skillSet = new SkillSet();
	//血盾，吸血，力场
	this.skillSet.add(new S9());
	this.skillSet.add(new S6());
	this.skillSet.add(new S8());
}; D.prototype = new Role();
function E()
{
	this.type = 5;
	this.name = "国王";
	this.itp = 5;
	this.icp = 5;
	this.iak = 1;
	this.weight = 5;
	this.desc = "本游戏的主角。拥有【护盾】，【蓄能】，【自愈】和【镇压】";
	this.spec = 1;//特殊角色
	this.skillSet = new SkillSet();
	this.skillSet.add(new S1());//护盾
	this.skillSet.add(new S5());//蓄能
	this.skillSet.add(new S2());//自愈
	this.skillSet.add(new S7());//镇压
}; E.prototype = new Role();
function F()
{
	this.type = 6;
	this.name = "士兵";
	this.itp = 2;
	this.icp = 2;
	this.iak = 1;
	this.weight = 1;
	this.desc = "无任何能力";
	this.spec = 1;//特殊角色
}; F.prototype = new Role();

//技能
function Skill(){
	/*
	子类：
		0 - 无 |
		1 - 护盾 |
		2 - 自愈 |
		3 - 牺牲 |
		4 - 绑定 |
		5 - 蓄能 |
		6 - 吸血 |
		7 - 镇压 |
		8 - 力场 |
		9 - 血盾 |
	*/
	this.type = 0;
	this.passive = false;//被动的
	this.once = false;//一次性的
	this.accumulate = false;//累积的
	this.level = 0;//累积等级
	this.used = false;//已使用过
	this.desc = "";//描述
	this.desc2 = "";//详细描述
	this.toString = function(){
		return "["+this.type+"]"+this.desc;
	}
}
{
	//护盾
	function S1(){
		this.type = 1;
		this.desc = "护盾";
		this.desc2 = "护盾能抵挡任何一次伤害";
	}; S1.prototype = new Skill();
	//自愈
	function S2(){
		this.type = 2;
		this.passive = true;
		this.desc = "自愈";
		this.desc2 = "【被动】每次行动开始时（第一回合除外），如果体力值是满的，自动增加 1 点体力和上限";
	}; S2.prototype = new Skill();
	//牺牲
	function S3(){
		this.type = 3;
		this.once = true;
		this.used = false;//已使用过
		this.desc = "牺牲";
		this.desc2 = "在没有队友的条件下，交换自己的现有体力值和攻击力\n-只能使用一次\n-使用后将失去【自愈】能力\n-使用后将永远无法增加体力上限";
	}; S3.prototype = new Skill();
	//绑定
	function S4(){
		this.type = 4;
		this.desc = "绑定";
		this.desc2 = "绑定一个玩家，使该玩家在其下回合不能行动（解除绑定），并消除其所有有利状态\n-被绑定的玩家受到的伤害将+1";
	}; S4.prototype = new Skill();
	//蓄能
	function S5(){
		this.type = 5;
		this.accumulate = true;//累积的
		this.level = 0;//累积等级
		this.desc = "蓄能";
		this.desc2 = "提高 1 点能量。能量的作用：";
		this.desc2 += "\n使用恢复时，能多恢复[攻击力*能量]点体力";
		this.desc2 += "\n使用强化时，能多强化[能量]点攻击力";
		this.desc2 += "\n攻击时，能多造成[攻击力*能量]点伤害，但能量会消失（即为零）";
	}; S5.prototype = new Skill();
	//吸血
	function S6(){
		this.type = 6;
		this.passive = true;
		this.desc = "吸血";
		this.desc2 = "【被动】攻击并造成伤害后，可以恢复伤害值的体力值\n-如果体力值满则增加 1 点体力和上限。";
	}; S6.prototype = new Skill();
	//镇压
	function S7(){
		this.type = 7;
		this.passive = true;
		this.desc = "镇压";
		this.desc2 = "【被动】攻击并造成伤害后，如果对方的权重大于或等于你的权重，窃取对方 1 点权重";
	}; S7.prototype = new Skill();
	//力场
	function S8(){
		this.type = 8;
		this.passive = true;
		this.desc = "力场";
		this.desc2 = "【被动】低于或等于你自身攻击力的攻击对你的伤害永远为 0。";
	}; S8.prototype = new Skill();
	//血盾
	function S9(){
		this.type = 9;
		this.desc = "血盾";
		this.desc2 = "给指定玩家添加一个附加状态，使其在下一次受到伤害时能抵挡部分伤害。抵挡的伤害值为你添加该状态时的攻击力。";
		this.desc2 += "\n当血盾值小于或等于 0 时，血盾即消失";
	}; S9.prototype = new Skill();
}

//附加状态
function Buff(){
	/*
	子类：
		0 - 无附加状态 |
		1 - 护盾 |
		2 - 牺牲 |
		3 - 绑定 |
		4 - 蓄能 |
		5 - 血盾 |
	*/
	this.type = 0;
	this.desc = "";//描述
	this.icon = "none";//图像
	this.accumulate = false;//是累积的
	this.permanent = false;//不可消除的
	this.level = 0;//累积等级
	this.toString = function(){
		return "["+this.type+"]"+this.desc;
	}
}
{
	//护盾
	function B1(){
		this.type = 1;
		this.icon = "img/icon/shield.png";//图像
		this.desc = "护盾";
	}; B1.prototype = new Buff();
	//牺牲
	function B2(){
		this.type = 2;
		this.icon = "img/icon/sacrifice.png";//图像
		this.permanent = true;
		this.desc = "牺牲";
	}; B2.prototype = new Buff();
	//绑定
	function B3(){
		this.type = 3;
		this.icon = "img/icon/chain.png";//图像
		this.desc = "绑定";
	}; B3.prototype = new Buff();
	//蓄能
	function B4(){
		this.type = 4;
		this.icon = "img/icon/fire.png";//图像
		this.accumulate = true;
		this.level = 0;
		this.desc = "蓄能";
	}; B4.prototype = new Buff();
	//血盾
	function B5(level){
		this.type = 5;
		this.icon = "img/icon/bloodshield.png";//图像
		this.accumulate = true;//是累积的
		this.level = level;//抵消值
		this.desc = "血盾";
	}; B5.prototype = new Buff();
}

//技能集
function SkillSet(){
	//---------属性---------
	this.skills = new Array();//(Skill)skill数组
	this.k = 0;
	
	//---------函数---------
	//添加一个skill（如果type已存在则返回false）
	this.add = function(skill){
		var res = true;
		for(var i=0;i<this.skills.length;i++){
			if(skill.type==this.skills[i].type){
				res = false;
			}
		}
		if(res){
			this.skills.push(skill);
		}
		return res;
	}
	//删除一个skill并返回之（如果没有则返回false）
	this.remove = function(skill){
		var res = false;
		for(var i=0;i<this.skills.length;i++){
			if(skill.type==this.skills[i].type){
				res = this.skills[i];
				var newSkills = new Array();
				for(var j=0;j<this.skills.length;j++){
					if(this.skills[j].type!=res.type){
						newSkills.push(this.skills[j]);
					}
				}
				this.skills = newSkills;
				break;
			}
		}
		return res;
	}
	//通过type删除一个skill并返回之（如果没有则返回false）
	this.removeByType = function(type){
		var res = false;
		for(var i=0;i<this.skills.length;i++){
			if(type==this.skills[i].type){
				res = this.skills[i];
				var newSkills = new Array();
				for(var j=0;j<this.skills.length;j++){
					if(this.skills[j].type!=res.type){
						newSkills.push(this.skills[j]);
					}
				}
				this.skills = newSkills;
				break;
			}
		}
		return res;
	}
	//获得一个skill（如果没有则返回false）
	this.get = function(skill){
		var res = false;
		for(var i=0;i<this.skills.length;i++){
			if(skill.type==this.skills[i].type){
				res = this.skills[i];
			}
		}
		return res;
	}
	//通过type获得一个skill（如果没有则返回false）
	this.getByType = function(type){
		var res = false;
		for(var i=0;i<this.skills.length;i++){
			if(type==this.skills[i].type){
				res = this.skills[i];
			}
		}
		return res;
	}
}

//附加状态集
function BuffSet(){
	//---------属性---------
	this.buffs = new Array();//(Buff)Buff数组
	
	//---------函数---------
	//添加一个buff（如果type已存在则返回false）
	this.add = function(buff){
		var res = true;
		for(var i=0;i<this.buffs.length;i++){
			if(buff.type==this.buffs[i].type){
				res = false;
			}
		}
		if(res){
			this.buffs.push(buff);
		}
		return res;
	}
	//删除一个buff并返回之（如果没有则返回false）
	this.remove = function(buff){
		var res = false;
		for(var i=0;i<this.buffs.length;i++){
			if(buff.type==this.buffs[i].type){
				res = this.buffs[i];
				var newBuffs = new Array();
				for(var j=0;j<this.buffs.length;j++){
					if(this.buffs[j].type!=res.type){
						newBuffs.push(this.buffs[j]);
					}
				}
				this.buffs = newBuffs;
				break;
			}
		}
		return res;
	}
	//通过type删除一个buff并返回之（如果没有则返回false）
	this.removeByType = function(type){
		var res = false;
		for(var i=0;i<this.buffs.length;i++){
			if(type==this.buffs[i].type){
				res = this.buffs[i];
				var newBuffs = new Array();
				for(var j=0;j<this.buffs.length;j++){
					if(this.buffs[j].type!=res.type){
						newBuffs.push(this.buffs[j]);
					}
				}
				this.buffs = newBuffs;
				break;
			}
		}
		return res;
	}
	//获得一个buff（如果没有则返回false）
	this.get = function(buff){
		var res = false;
		for(var i=0;i<this.buffs.length;i++){
			if(buff.type==this.buffs[i].type){
				res = this.buffs[i];
			}
		}
		return res;
	}
	//通过type获得一个buff（如果没有则返回false）
	this.getByType = function(type){
		var res = false;
		for(var i=0;i<this.buffs.length;i++){
			if(type==this.buffs[i].type){
				res = this.buffs[i];
			}
		}
		return res;
	}
}

//玩家
function Player(name,id,role)
{
	//------------属性------------
	this.role = new Role();
	/*
	当前行动表现
	act = {	0=无行动;
			1=体力回复;
			2=体力+上限回复;
			3=上限+体力+攻击强化;
			4=攻击强化;
			5=攻击;
			6=受到攻击;
			7=吸血（攻击+体力回复）;
			8=吸血（攻击+体力+体力上限回复）;
			9=上限达到峰值;
			10=上限增加;
			11=强化（上限达到峰值）;
			12=加权;
			13=死亡;
			14=置后;
			101=开启护盾;
			102=取消护盾;
			103=攻击并破坏目标的护盾;
			104=牺牲;
			105=蓄能;
			107=绑定;
			108=被绑定;
			109=解除绑定;
			110=启动血盾;
			}
	tp1 = 上限增加值
	cp1 = 体力增加值
	ak1 = 攻击增加值
	cp2 = 体力减少值
	we1 = 权增加值
	we2 = 权减少值（如果存在则说明触发）
	hi = 0:无意义 | 2：关闭血盾
	hi1 = 当前的血盾值
	hi2 = 血盾被抵消值
	*/
	this.op = new Array("act","tp1","cp1","ak1","cp2","we1","we2","hi","hi1","hi2");
	this.buffSet = new BuffSet();//附加状态集
	this.name = "none";
	this.color = "none";
	this.id = this.tp = this.cp = this.ak = this.weight = this.kill = this.team = -1;
	this.actionNo = 0;//行动者序号
	this.alive = false;//存活
	this.hasTeam = false;//已选好阵营
	this.hasRole = false;//已选好角色
	this.isComputer = false;//是电脑
	this.isActor = false;//是行动者
	this.isBound = false;//被绑定
	this.killer = 0;//待定凶手ID
	if(role) 
	{
		this.role = role;
		this.tp = role.itp;
		this.cp = role.icp;
		this.ak = role.iak;
	}
	if(name) this.name = name;
	if(id) this.id = id;
	
	//------------函数------------
	
	this.copy = function()
	{
		var res = new Player(this.name,this.id,this.role);
		res.op = this.op;
		res.alive = this.alive;
		res.isComputer = this.isComputer;
		res.kill = this.kill;
		res.team = this.team;
		res.hasTeam = this.hasTeam;
		res.tp = this.tp;
		res.cp = this.cp;
		res.ak = this.ak;
		res.weight = this.weight;
		res.color = this.color;
		res.hasRole = this.hasRole;
		return res;
	}
	
	this.toString = function()
	{
		if(this.hasTeam)
			return this.team+"] "+this.name+"("+this.id+")"+" | 角色："+this.role.name+" | 体力："+this.cp+"/"+this.tp+" | 攻击力："+this.ak;
		else
			return "-] "+this.name+"("+this.id+")"+" | 角色："+this.role.name+" | 体力："+this.cp+"/"+this.tp+" | 攻击力："+this.ak;
	}
	this.toString2 = function()
	{
		return "name:"+this.name
				+"\n color:"+this.color
				+"\n id:"+this.id
				+"\n tp:"+this.tp
				+"\n cp:"+this.cp
				+"\n ak:"+this.ak
				+"\n weight:"+this.weight
				+"\n kill:"+this.kill
				+"\n team:"+this.team
				+"\n alive:"+this.alive
				+"\n hasTeam:"+this.hasTeam
				+"\n hasRole:"+this.hasRole
				+"\n isComputer:"+this.isComputer
				+"\n isActor:"+this.isActor
				+"\n op[\n ---act:"+this.op["act"]
				+"\n ---tp1:"+this.op["tp1"]
				+"\n ---cp1:"+this.op["cp1"]
				+"\n ---ak1:"+this.op["ak1"]
				+"\n ---cp2:"+this.op["cp2"]
				+"\n ---we1:"+this.op["we1"]
				+"]"
				+"\n role[\n ---name:"+this.role.name
				+"\n ---itp:"+this.role.itp
				+"\n ---icp:"+this.role.icp
				+"\n ---iak:"+this.role.iak
				+"\n ---weight:"+this.role.weight
				+"\n ---icon:"+this.role.icon
				+"]\n";
	}
	
	this.toJSON = function()
	{
		var res = "";
		res += "{";
		res += "\"name\":\""+this.name+"\",";
		res += "\"color\":\""+this.color+"\",";
		res += "\"id\":"+this.id+",";
		res += "\"tp\":"+this.tp+",";
		res += "\"cp\":"+this.cp+",";
		res += "\"ak\":"+this.ak+",";
		res += "\"weight\":"+this.weight+",";
		res += "\"kill\":"+this.kill+",";
		res += "\"team\":"+this.team+",";
		res += "\"alive\":\""+this.alive+"\",";
		res += "\"hasTeam\":\""+this.hasTeam+"\",";
		res += "\"hasRole\":\""+this.hasRole+"\",";
		res += "\"isComputer\":\""+this.isComputer+"\",";
		res += "\"isActor\":\""+this.isActor+"\",";
		res += "\"actionNo\":\""+this.actionNo+"\",";
		//op
		res += "\"op\":{";
		res += "\"act\":"+this.op["act"]+",";
		res += "\"tp1\":"+this.op["tp1"]+",";
		res += "\"cp1\":"+this.op["cp1"]+",";
		res += "\"ak1\":"+this.op["ak1"]+",";
		res += "\"cp2\":"+this.op["cp2"]+",";
		res += "\"we1\":"+this.op["we1"];
		res += "},";
		//role
		res += "\"role\":{";
		res += "\"type\":\""+this.role.type+"\",";
		res += "\"name\":\""+this.role.name+"\",";
		res += "\"itp\":"+this.role.itp+",";
		res += "\"icp\":"+this.role.icp+",";
		res += "\"iak\":"+this.role.iak+",";
		res += "\"weight\":"+this.role.weight+",";
		res += "\"icon\":\""+this.role.icon+"\"";
		res += "}";
		
		res += "}";
		return res;
	}
	
	this.init = function(isComputer)
	{
		if(isComputer) this.isComputer = isComputer;
		this.tp = this.role.itp;
		this.cp = this.role.icp;
		this.ak = this.role.iak;
		this.kill = 0;
		this.weight = this.role.weight;
		this.alive = true;
		this.isActor = true;
		for(var i=0;i<this.op.length;i++){
			this.op[this.op[i]]=0;
		}
	}
	
	this.initOp = function()
	{
		this.op["act"]=
		this.op["tp1"]=
		this.op["cp1"]=
		this.op["ak1"]=
		this.op["cp2"]=
		this.op["we2"]=
		this.op["hi"]=
		this.op["hi1"]=
		this.op["hi2"]=0;
	}
	
	this.r = function()//恢复
	{
		var tp,cp,ak,op,level;
		tp=this.tp;cp=this.cp;ak=this.ak;op=this.op;level=this.buffSet.getByType(4).level;
		
		if(level==undefined) level = 0;
		
		var sup = ak*(level+1);//真实提升值
		
		if(cp>=tp){//如果满血
			if(tp+ak>=maxHP&&!this.buffSet.getByType(2)!=false){
				op["act"]=9;op["tp1"]= maxHP-tp;
				tp = maxHP;
			}
			else{
				op["act"]=10;op["tp1"]= ak;
				tp += ak;
			}
		}
		else if(sup+cp>tp){//如果可补满血
			op["act"]=1;op["cp1"]=tp-cp;
			cp = tp;
		}
		else{//如果不可不满血
			op["act"]=1;op["cp1"]=sup;
			cp += sup;
		}
		
		this.tp = tp;this.cp = cp;this.ak = ak;this.op = op;
	}
	
	this.s = function()//强化
	{
		var tp,cp,ak,op,level;
		tp=this.tp;cp=this.cp;ak=this.ak;op=this.op;level=this.buffSet.getByType(4).level;
		
		if(level==undefined) level = 0;
		
		ak += level+1;
		if(cp>=tp&&!this.buffSet.getByType(2)!=false){
			if(cp>=maxHP){
				op["act"]=11;op["ak1"]=level+1;
			}
			else{
				op["act"]=3;op["ak1"]=level+1;op["tp1"]=1;op["cp1"]=1;
				cp += 1;
				tp += 1;
			}
		}
		else{
			op["act"]=4;op["ak1"]=level+1;
		}
		
		this.tp = tp;this.cp = cp;this.ak = ak;this.op = op;
	}
	
	this.w = function()//加权
	{
		this.weight += 1;
		this.op["act"]=12;this.op["we1"]=1;
	}
	
	this.a = function(p,suck)//攻击
	{
		var tp,cp,ak,op,level,bindDamage,hind;
		tp=this.tp;cp=this.cp;ak=this.ak;op=this.op;
		level=this.buffSet.getByType(4).level;//蓄能等级
		bindDamage=p.buffSet.getByType(3)!=false?1:0;//绑定附加伤害
		hind=p.buffSet.getByType(5).level;//血盾的抵消伤害
		
		if(level==undefined) level = 0;
		if(hind==undefined) hind = 0;
		
		var sup = ak*(level+1)+bindDamage;//真实伤害值
		var nhind = sup;//抵消的伤害
		sup -= hind;
		if(sup<0) sup=0;
		level = 0;
		this.buffSet.removeByType(4);//解除蓄能buff
		p.d(sup,this,nhind);
		if(p.op["act"]==102){//如果对方护盾被破坏
			op["act"] = 103;
		}
		else if(suck||this.role.skillSet.getByType(6)!=false){//如果吸血
			if(cp>=tp&&tp<maxHP&&!this.buffSet.getByType(2)!=false){
				op["act"]=8;op["tp1"]=1;op["cp1"]=1;
				cp += 1; tp += 1;
			}
			else if(sup+cp>=tp){
				op["act"]=7;op["cp1"]=tp-cp;
				cp = tp;
			}
			else{
				op["act"]=7;op["cp1"]=sup;
				cp += sup;
			}
		}
		else{
			op["act"]=5;
		}
		
		this.tp = tp;this.cp = cp;this.ak = ak;this.op = op;
		this.role.skillSet.getByType(5).level = level;
	}
	
	this.d = function(ak,P,hind)//受到攻击(伤害值，伤害来源，抵消伤害)
	{
		if(this.buffSet.getByType(1)!=false){//如果有护盾
			this.op["act"]=102;
			this.buffSet.removeByType(1);//取消护盾
		}
		else{
			this.op["act"]=6;
			if(hind>0){
				this.buffSet.getByType(5).level -= hind;//自己当前的血盾值 -= 被抵消的伤害
				if(this.buffSet.getByType(5).level<=0){
					this.buffSet.getByType(5).level = 0;
					this.bloodshieldClose();//关闭血盾
				}
				this.op["hi1"] = hind;
				this.op["hi2"] = this.buffSet.getByType(5).level;
			}
			if(this.role.skillSet.getByType(8)==false//如果没有【力场】
					||(this.role.skillSet.getByType(8)!=false&&ak>this.ak)){//如果有【力场】，并且伤害大于自己的攻击力 
				this.cp -= ak;
				this.op["cp2"]=ak;
			}
			else{
				this.op["cp2"]=0;
			}
			if(this.weight>=P.weight&&P.role.skillSet.getByType(7)!=false){//如果有镇压能力
				this.op["we2"]=1;
				this.weight -= 1;
				P.weight += 1;
			}
			if(this.cp<=0){
				this.op["act"]=13;
			}
		}
	}

	this.dead = function()//死亡
	{
		this.alive = false;
		//清除所有buff
		for(var i=0;i<this.buffSet.buffs.length;i++){
			if(this.buffSet.buffs[i].type==4){//清除能级
				this.role.skillSet.getByType(5).level = 0;
			}
			this.buffSet.remove(this.buffSet.buffs[i]);
			i--;
		}
	}
	
	this.shieldOpen = function()//开启护盾
	{
		this.op["act"]=101;
		this.buffSet.add(new B1());
	}
	
	this.shieldClose = function()//取消护盾
	{
		this.op["act"]=102;
		this.buffSet.removeByType(1);
	}

	this.selfUp = function()//进行自愈(如果失败返回false)
	{
		var res = false;
		if(this.canSelfUp()){
			res = true;
			this.tp ++;
			this.cp ++;
			this.op["act"] = 2; this.op["tp1"] = 1; this.op["cp1"] = 1;
		}
		return res;
	}
	
	this.canSelfUp = function()//判断是否能自愈
	{
		return this.tp<=this.cp&&this.tp<maxHP&&!(this.buffSet.getByType(2)!=false);
	}

	this.sacrifice = function(con)//进行牺牲(如果失败返回false) con-条件允许
	{
		var res = false;
		if(this.ak>0&&con){
			res = true;
			var temp = this.cp;
			this.cp = this.ak;
			this.ak = temp;
			var skill = this.role.skillSet.getByType(3);
			if(skill!=false){
				skill.used =true;
				this.buffSet.add(new B2());
			}
			this.role.skillSet.removeByType(2);//移除【自愈】技能
			this.op["act"] = 104;
		}
		return res;
	}
	
	this.fire = function()//蓄能
	{
		var skill = this.role.skillSet.getByType(5);
		var buff = this.buffSet.getByType(4);
		skill.level += 1;
		if(buff==false){
			buff = new B4();
			buff.level = skill.level;
			this.buffSet.add(buff);//添加蓄能buff
		}
		else{
			this.buffSet.getByType(4).level = skill.level;
		}
		this.op["act"] = 105;
	}
	
	this.bind = function(p)//绑定目标
	{
		p.bound();
		this.op["act"] = 107;
	}
	
	this.bound = function()//被绑定
	{
		this.isBound = true;
		this.clearBuffs();//清除buff
		this.buffSet.add(new B3());
		this.op["act"] = 108;
	}
	
	this.unbind = function()//解除绑定
	{
		this.isBound = false;
		this.buffSet.removeByType(3);
		this.op["act"] = 109;
	}
	
	this.bloodshieldOpen = function(p)//启动血盾
	{
		this.op["act"]=110;//启动血盾
		this.op["hi1"]=this.ak;//血盾值
		if(p.buffSet.getByType(5)!=false&&p.buffSet.getByType(5).level<this.ak){
			p.buffSet.getByType(5).level = this.ak;
		}
		else{	
			p.buffSet.add(new B5(this.ak));
		}
	}
	
	this.bloodshieldClose = function()//关闭血盾
	{
		this.op["hi"]=2;//关闭血盾
		this.buffSet.removeByType(5);
	}
	
	this.clearBuffs = function()//清除非永久buff
	{
		for(var i=0;i<this.buffSet.buffs.length;i++){
			if(!this.buffSet.buffs[i].permanent){
				if(this.buffSet.buffs[i].type==4){//清除能级
					this.role.skillSet.getByType(5).level = 0;
				}
				this.buffSet.remove(this.buffSet.buffs[i]);
				i--;
			}
		}
	}
}

//队伍
function Team(id,name,color)
{
	this.players = new Array();
	this.id = -1;
	this.name = "none";
	this.color = "black";
	this.alive = true;
	if(id) this.id = id;
	if(name) this.name = name;
	if(color) this.color = color;
	
	this.toString = function(){
		return this.name+"("+this.id+")("+this.color+")(玩家数："+this.players.length+")";
	}
	
	this.toJSON = function(){
		var res = "[";
		for(var i=0;i<this.players.length;i++){
			res += this.players[i].toJSON();
			if(i!=this.players.length-1) res += ",";
		}
		res += "]";
		return res;
	}
	
	//复制
	this.copy = function(){
		var res = new Team(this.id,this.name,this.color);
		for(var i=0;i<this.players.length;i++){
			res.players[i] = this.players[i].copy();
		}
		return res;
	}
	//添加
	this.add = function(p){
		if(!this.hasPlayer(p)){
			this.players.push(p);
		}
	}
	//删除
	this.remove = function(p){
		var res;
		for(var i=0;i<this.players.length;i++){
			if(this.players[i].id==p.id){
				res = this.players[i];
				var newPlayers = new Array();
				for(var j=0;j<this.players.length;j++){
					if(this.players[j].id!=res.id){
						newPlayers.push(this.players[j]);
					}
				}
				this.players = newPlayers;
				break;
			}
		}
		return res;
	}
	//根据ID删除
	this.removeByID = function(id){
		var res;
		for(var i=0;i<this.players.length;i++){
			if(this.players[i].id==id){
				res = this.players[i];
				var newPlayers = new Array();
				for(var j=0;j<this.players.length;j++){
					if(this.players[j].id!=res.id){
						newPlayers.push(this.players[j]);
					}
				}
				this.players = newPlayers;
				break;
			}
		}
		return res;
	}
	//含有
	this.hasPlayer = function(p){
		for(var i=0;i<this.players.length;i++){
			if(this.players[i].id==p.id) return true;
		}
		return false;
	}
	//根据ID含有
	this.hasPlayerByID = function(id){
		for(var i=0;i<this.players.length;i++){
			if(this.players[i].id==id) return true;
		}
		return false;
	}
	//根据ID获取
	this.getByID = function(id){
		for(var i=0;i<this.players.length;i++){
			if(this.players[i].id==id){
				return this.players[i];
			}
		}
		return false;
	}
	//清空全部行动者序号
	this.clearActionNo = function(){
		for(var i=0;i<this.players.length;i++){
			this.players[i].actionNo = 0;
		}
		return 0;
	}
}

//图片读取器
function ImageLoader()
{
	this.arr = new Array();//二维数组;其中每一项为数组为：array {name, image}
	this.srcArr = new Array();
	this.load = function(name,src){
		var img = new Image();
		img.src = src;
		var I = new Array(name,img);
		var S = new Array(name,src);
		this.arr.push(I);
		this.srcArr.push(S);
	}
	this.img = function(name){
		for(var i=0;i<this.arr.length;i++){
			var img = this.arr[i];
			if(img[0]==name) return img;
		}
		return this.arr[0];
	}
	this.src = function(name){
		for(var i=0;i<this.srcArr.length;i++){
			var src = this.srcArr[i];
			if(src[0]==name) return src[1];
		}
		return this.srcArr[0][1];
	}
}


//------------------------------------主函数------------------------------------
function Init(Can,imgLoader,cxt,W,H)
{
	this.Can = Can;
	this.imgLoader = imgLoader;
	this.all = new Team();
	this.cxt = cxt;
	this.W = W;
	this.H = H;
	
	//--------函数--------
	
	//初始化
	this.init = function(){
		var body = this.Can;
		var role = player = computer = team = 0;
		var all = new Team();
		var teams = new Array();
		var team_colors = new Array("#1F47FF","green","#777","#EA9E1C","purple","#F77C97");
		var chooses = new Array(new A(), new B(), new C(), new D(), new F(), new E());
		chooses[0].icon = this.imgLoader.src("A");
		chooses[1].icon = this.imgLoader.src("B");
		chooses[2].icon = this.imgLoader.src("C");
		chooses[3].icon = this.imgLoader.src("D");
		chooses[4].icon = this.imgLoader.src("F");
		chooses[5].icon = this.imgLoader.src("E");
		var canvas = body.children().eq(0);
		var I = $("#info1");
		
		canvas.css("display","none");
		panel1();
		
		//==================>第一步：选择玩家总数
		function panel1(){
			var txt = "";
			body.text("");
			txt += "<div id=\"panel1\">";
			txt += "<div class=\"_el3\">请输入<red>玩家总数</red>:<br/>(最少 <red>2</red> 人，最多 <red>"+maxPlayerNum+"</red> 人)</div>";
			txt += "<div class=\"_d\"><input class=\"_el4\" type=\"number\" value=\"2\" id=\"val1\"/></div>";
			txt += "<div class=\"_clear\"></div>";
			txt += "<div class=\"_d\"><button class=\"_btn1\" id=\"bt1\" >确定</button></div>";
			txt += "</div>";
			body.append(txt);
			$("#val1").focus();
			$("#bt1").bind("click",function(){nextPage();});
			$("body").keydown(function(event){
				if(event.which==13) nextPage();
			});
			function nextPage(){
				var v = $("#val1");
				if(parseInt(v.val())<=maxPlayerNum&&parseInt(v.val())>=2){
					role = parseInt(v.val());
					for(var i=0;i<role;i++){
						var newPlayer = new Player("NaN",i+1);
						newPlayer.actionNo = i+1;
						all.add(newPlayer);
					}
					panel2();
				}
			}
		}
		//==================>第二步：选择电脑数量
		function panel2(){
			var txt = "";
			body.text("");
			txt += "<div id=\"panel2\">";
			txt += "<div class=\"_el3\">请输入<red>人类玩家数量</red>:<br/>(最少 <red>1</red> 人，最多 <red>"+role+"</red> 人)</div>";
			txt += "<div class=\"_d\"><input class=\"_el4\" type=\"number\" value=\"1\" id=\"val2\"/></div>";
			txt += "<div class=\"_clear\"></div>";
			txt += "<div class=\"_d\"><button class=\"_btn1\" id=\"bt2\" >确定</button></div>";
			txt += "</div>";
			body.append(txt);
			$("#val2").focus();
			$("#bt2").bind("click",function(){nextPage();});
			$("body").keydown(function(event){
				if(event.which==13) nextPage();
			});
			function nextPage(){
				var v = $("#val2");
				if(parseInt(v.val())<=role&&parseInt(v.val())>=0){
					var i=0;
					player = parseInt(v.val());
					computer = role-player;
					for(;i<player;i++){
						all.players[i].isComputer = false;
						all.players[i].name = "玩家"+(i+1);
					}
					for(var j=0;j<computer;j++,i++){
						all.players[i].isComputer = true;
						all.players[i].name = "电脑"+(j+1);
					}
					panel21();
				}
			}
		}
		//==================>第2.5步：设置玩家名字
		function panel21(){
			var txt = "";
			body.text("");
			txt += "<div id=\"panel2\">";
			txt += "<div class=\"_el3\">请设置<red>玩家的名字</red>:</div>";
			txt += "<div class=\"_el16 _radius10px\">"
			for(var i=0;i<all.players.length;i++){
				txt += "<div id=\"P"+all.players[i].id+"\"><input value=\""+all.players[i].name+"\"></input></div>";
			}
			txt += "<div class=\"_clear\"></div>";
			txt += "</div>";
			txt += "<div class=\"_d\"><button class=\"_btn1\" id=\"bt21\" >确定</button></div>";
			txt += "</div>";
			body.append(txt);
			$("#P1").children().eq(0).focus();
			$("#bt21").bind("click",function(){nextPage();});
			$("body").keydown(function(event){
				if(event.which==13) nextPage();
			});
			
			function nextPage(){
				var valid = true;
				for(var i=0;i<all.players.length;i++){
					var newName = $("#P"+all.players[i].id).children().eq(0).val();
					if(newName.length<=5){
						all.players[i].name = newName;
					}
					else{
						valid = false;
					}
				}
				if(valid){
					panel3();
				}
				else{
					alert("名字长度不能超过5个字符");
				}
			}
		}
		//==================>第三步：选择阵营数量
		function panel3(){
			var txt = "";
			body.text("");
			txt += "<div id=\"panel3\">";
			txt += "<div class=\"_el3\">请选择<red>阵营数量</red>:";
			txt += "<select class=\"_el4\" id=\"val3\">";
			txt += "<option value=\"0\">0</option>";
			txt += "<option value=\"2\" select=\"select\">2</option>";
			txt += "<option value=\"3\">3</option>";
			txt += "<option value=\"4\">4</option>";
			txt += "<option value=\"5\">5</option>";
			txt += "<option value=\"6\">6</option>";
			txt += "</select>";
			txt += "<div class=\"_clear\"></div>";
			txt += "<div class=\"_d\"><button class=\"_btn1\" id=\"bt3\" >确定</button></div>";
			txt += "</div>";
			body.append(txt);
			$("#val3").focus();
			$("#bt3").bind("click",function(){nextPage()});
			$("body").keydown(function(event){
				if(event.which==13) nextPage();
			});
			function nextPage(){
				team = parseInt($("#val3").val());
				for(var i=0;i<team;i++){
					teams.push(new Team(i+1,"队伍"+(i+1),team_colors[i]));
				}
				if(team!=0) panel4();
				else panel5();
			}
		}
		//==================>第四步：分配阵营
		function panel4(){
			//alert(roles.length+" | "+players.length+" | "+computers.length+" | "+teams.length);
			//var I = $("#info1");I.text("");
			//for(var i=0;i<teams.length;i++) I.append(teams[i]+" <br/> ");
			
			var txt = "";
			body.text("");
			txt += "<div id=\"panel4\">";
			txt += "<div class=\"_el8\" >分配<red>阵营</red>:</div>";
			
			//左侧栏开始
			txt += "<div id=\"panel3-1\" class=\"_frame1 _radius5px\">";
			txt += "<div class=\"_el9\" >单击选取<red>玩家</red>:</div>";
			for(var i=0;i<all.players.length;i++){
				if(!all.players[i].hasTeam){
					txt += "<div class=\"_el5\" draggable=\"true\" value=\""+all.players[i].id+"\">"
					if(!all.players[i].isComputer) txt += "<blue>"+all.players[i].name+"</blue>";
					else txt += "<black>"+all.players[i].name+"</black>";
					txt += "</div>";
				}
			}
			txt += "<div class=\"_clear\"></div>";
			txt += "</div>";
			//左侧栏结束
			
			//右侧栏开始
			txt += "<div id=\"panel3-2\" class=\"_frame2 _radius5px\">";
			for(var i=0;i<teams.length;i++){
				txt += "<div class=\"_el6\"><button class=\"_btn3\" id=\"T"+teams[i].id+"\" value=\""
						+teams[i].id+"\">加入<br/>"+teams[i].name+"</button></div>";
				txt += "<div class=\"_el7\" value=\""+teams[i].id+"\">"
				txt += "&nbsp;";
				for(var j=0;j<all.players.length;j++){
					if(all.players[j].hasTeam&&all.players[j].team==teams[i].id){
						if(!all.players[j].isComputer) 
							txt += "<div class=\"_el10\" draggable=\"true\" title=\"点击复位\" value=\""+all.players[j].id+"\"><blue>"
									+all.players[j].name+"</blue>,</div>";
						else 
							txt += "<div class=\"_el10\" draggable=\"true\" title=\"点击复位\" value=\""+all.players[j].id+"\"><black>"
									+all.players[j].name+"</black>,</div>";
					}
				}
				txt += "</div>";
			}
			txt += "<div class=\"_clear\"></div>";
			txt += "</div>";
			//右侧栏结束
			
			txt += "<div class=\"_clear\"></div>";
			txt += "<div class=\"_d\"><button class=\"_btn2\" id=\"bt4\" >确定</button></div>";
			txt += "</div>";
			body.append(txt);
			
			//设置【队伍栏】
			for(var i=0;i<teams.length;i++){
				var b = $("#T"+teams[i].id);
				b.css("background-color",teams[i].color);
				b.parent().next().css("border","solid 3px "+teams[i].color);
				//设置【加入队伍】按钮
				b.bind("click",function(){
						for(var j=0;j<all.players.length;j++){
							var d = $("#panel3-1").children().eq(j+1);
							if(d.hasClass("_selected")){
								var id = parseInt(d.attr("value"));
								var r = all.getByID(id);
								//添加到该队
								r.hasTeam = true;
								r.color = teams[parseInt($(this).attr("value"))-1].color;
								r.team = parseInt($(this).attr("value"));
							}
						}
						panel4();
					});
				//为该队伍栏中的每个玩家名字设置【复位】按钮
				var k = 0;
				for(var j=0;j<all.players.length;j++)
				{
					if(all.players[j].team==teams[i].id){
						var p = b.parent().next().children().eq(k);
						p.bind("click",function(){
								var id = parseInt($(this).attr("value"));
								//从该队移除
								var r = all.getByID(id);
								r.hasTeam = false;
								r.color = "none";
								r.team = parseInt($(this).parent().prev().children().eq(0).attr("value"));
								panel4();
							})
						k++;
					}
				}
			}
			$("._el5").bind("click",function(){
				if(!$(this).hasClass("_selected")) $(this).addClass("_selected");
				else $(this).removeClass("_selected");
			});
			$("#bt4").bind("click",function(){nextPage()});
			$("#bt4").focus();
			
			function nextPage(){
				var valid = 1;//可以进行下一步
				var validTeams = 0;
				for(var i=0;i<all.players.length;i++){
					if(!all.players[i].hasTeam){
						valid = -1;
						break;
					}
				}
				if(valid==1){
					valid = -2;
					var teamNO = all.players[0].team;
					for(var i=1;i<all.players.length;i++){
						if(all.players[i].team!=teamNO){
							valid = 1;
							break;
						}
					}
				}
				if(valid == 1) panel5();
				else if(valid==-1) alert("仍有玩家未分配到阵营中。");
				else if(valid==-2) alert("未发现敌对阵营。");
			}
		}
		//==================>第五步：电脑自动分配角色
		function panel5(){
			for(var i=0;i<all.players.length;i++){
				if(all.players[i].isComputer){
					var r = parseInt((Math.random()*chooses.length));
					all.players[i].role = chooses[r];
					while(chooses[r].spec!=0){
						r = parseInt((Math.random()*chooses.length));
						all.players[i].role = chooses[r];
					}
					all.players[i].hasRole = true;
					all.players[i].init();
				}
			}
			panel6();
		}
		//==================>第六步：手动选择角色
		function panel6(){
			
			var txt = "";
			body.text("");
			txt += "<div id=\"panel5\">";
			txt += "<div class=\"_el8\" >分配<red>角色</red>:</div>";
			
			//上侧栏开始
			txt += "<div id=\"panel5-1\" class=\"_frame3 _radius5px\">";
			txt += "<div class=\"_block1\">";
			for(var i=0;i<chooses.length;i++){
				txt += "<div class=\"_el11\" value=\""+i+"\" title=\""+chooses[i].desc+"\">";
				txt += "<img src=\""+chooses[i].icon+"\" width=40px height=40px/><br/>";
				txt += chooses[i].name;
				if(chooses[i].spec!=0) txt += "(特殊)";
				txt += "<br/>";
				txt += "<black>体力："+chooses[i].icp+"/"+chooses[i].itp+"<br/>";
				txt += "<black>攻击："+chooses[i].iak+"<br/>";
				txt += "<black>权重："+chooses[i].weight+"<br/>";
				txt += "</div>";
			}
			txt += "<div class=\"_el11\" value=\"rand\" title=\"随机不会选择特殊角色\">";
			txt += "<br/><img src=\""+imgLoader.src("Q")+"\" width=40px height=40px/><br/>";
			txt += "<red>随机";
			txt += "</div>";
			txt += "</div>";
			txt += "<div class=\"_clear\"></div>";
			txt += "</div>";
			//上侧栏结束
			
			txt += "<div class=\"_el9\" >选取<red>玩家</red>，再点击<red>角色</red>(双击任意玩家可全选):</div>";
			//下侧栏开始
			txt += "<div id=\"panel5-2\" class=\"_frame4 _radius5px\" >";
			txt += "<div class=\"_block1\">";
			for(var i=0;i<all.players.length;i++){
				txt += "<div class=\"_el13\" >";
				txt += "<div class=\"_el12 \" draggable=\"true\" value=\""+all.players[i].id+"\">";
				txt += "<div>";
				if(all.players[i].hasRole) txt += "<img src=\""+all.players[i].role.icon+"\" class=\"_el14\"/>";
				else txt += "<img src=\""+imgLoader.src("Q")+"\" class=\"_el14\"/>";
				txt += "<div class=\"_cursor-pointer\">"+all.players[i].name+"<br/>("+all.players[i].role.name+")"+"</div>";
				txt += "</div>";
				txt += "</div>";
				txt += "</div>";
			}
			txt += "</div>";
			txt += "<div class=\"_clear\"></div>";
			txt += "</div>";
			//下侧栏结束
			
			txt += "<div class=\"_clear\"></div>";
			txt += "<div class=\"_d\"><button class=\"_btn2\" id=\"bt6\" >确定</button></div>";
			txt += "</div>";
			body.append(txt);
			
			var selectAll = false;
			var p1 = $("#panel5-1").children().eq(0);
			var p2 = $("#panel5-2").children().eq(0);
			//添加队伍颜色
			for(var i=0;i<all.players.length&&team>0;i++){
				var d = p2.children().eq(i).children().eq(0);
				var id = d.attr("value");
				d.css("background-color",all.getByID(id).color);
			}
			//玩家选取功能
			$("._el13").bind("click",function(){
				if(!$(this).hasClass("_selected2")){
					$(this).css("border-color","#111");
					$(this).addClass("_selected2");
				}
				else {
					$(this).css("border-color","transparent");
					$(this).removeClass("_selected2");
				}
			});
			$("._el13").bind("dblclick",function(){
				if(!selectAll){
					$("._el13").css("border-color","#111");
					$("._el13").addClass("_selected2");
					selectAll = true;
				}
				else {
					$("._el13").css("border-color","transparent");
					$("._el13").removeClass("_selected2");
					selectAll = false;
				}
			});
			//选择角色功能
			for(var i=0;i<chooses.length;i++){
				var d = p1.children().eq(i);
				d.bind("click", function(){
						var r = chooses[parseInt($(this).attr("value"))];
						for(var i=0;i<all.players.length;i++){
							var d = p2.children().eq(i);
							if(d.hasClass("_selected2")){
								all.players[i].role = r;
								all.players[i].hasRole = true;
								all.players[i].init();
							}
						panel6();
						}
					});
			}
			//随机
			var rd = p1.children().eq(chooses.length);
			rd.bind("click", function(){
					for(var i=0;i<all.players.length;i++){
						var d = p2.children().eq(i);
						if(d.hasClass("_selected2")){
							all.players[i].role = new Role();
							all.players[i].role.name = "随机";
							all.players[i].hasRole = false;
						}
					}
					panel6();
				});
			$("#bt6").bind("click",function(){panel7();});
			$("#bt6").focus();
		}
		//==================>第七步：完成随机角色分配
		function panel7(){
			body.text("");
			for(var i=0;i<all.players.length;i++){
				if(!all.players[i].hasRole){
					var r = parseInt(Math.random()*firstRandom);
					all.players[i].role = chooses[r];
					while(all.players[i].isComputer&&all.players[i].role.spec!=0){
						r = parseInt(Math.random()*chooses.length);
						all.players[i].role = chooses[r];
					}
					all.players[i].hasRole = true;
					all.players[i].init();
				}
			}
			exportXML(all);
		}
		//==================>第八步：写入XML文件
		function exportXML(all){
			var writeData = all.toJSON();
			$("#title").text("数据生成中...");
			$.post(
				"operation.php",
				{
					"W":writeData,
					"F":readFile
				},
				function(res){
					$("#title").text("数据生成成功!");
					if(res=="1") location = "J.html";
					else {
						$("#title").text("【无法执行】数据生成失败");
						$("body").append(res);
					}
				}
			)
		}
		return all;
	}
}





















