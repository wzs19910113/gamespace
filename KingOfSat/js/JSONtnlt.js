function JSONtnltor(){
	//------------属性------------
	
	//------------函数------------
	this.exec = function(data){
		var res = new Team();
		for(var i=0;i<data.length;i++){
			var r;
			var p = new Player();
			var d = data[i];
			switch(d["role"]["type"]){
				case "1":{
					r = new A();
					break;
				}
				case "2":{
					r = new B();
					break;
				}
				case "3":{
					r = new C();
					break;
				}
				case "4":{
					r = new D();
					break;
				}
				case "5":{
					r = new E();
					break;
				}
				default:{
					r = new Role();
				}
			}
			r.name = d["role"]["name"];
			r.itp = d["role"]["itp"];
			r.icp = d["role"]["icp"];
			r.iak = d["role"]["iak"];
			r.weight = d["role"]["weight"];
			r.icon = d["role"]["icon"];
			
			p.id = d["id"];
			p.name = d["name"];
			p.color = d["color"];
			p.weight = d["weight"];
			p.kill = d["kill"];
			p.team = d["team"];
			p.actionNo = d["actionNo"];
			p.alive = d["alive"]=="true"?true:false;
			p.hasTeam = d["hasTeam"]=="true"?true:false;
			p.hasRole = d["hasRole"]=="true"?true:false;
			p.isActor = d["isActor"]=="true"?true:false;
			p.role = r;
			p.init(d["isComputer"]=="true"?true:false);
			p.tp = d["tp"];
			p.cp = d["cp"];
			p.ak = d["ak"];
			p.weight = d["weight"];
			
			res.add(p);
		}
		return res;
	}
}