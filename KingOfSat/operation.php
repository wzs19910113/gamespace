<?
if(!empty($_POST)){
	if(isset($_POST["W"])&&isset($_POST["F"])){
		$W = stripcslashes($_POST["W"]);
		$F = $_POST["F"];
		if(json_decode($W)==NULL){
			echo "Cannot decode JSON.";
			die();
		}
		$file = fopen($F,"w+");
		fwrite($file,$W);
		fclose($file);
		
		echo 1;
	}
}
if(!empty($_GET) and isset($_GET["OP"])){
	$OP = $_GET["OP"];
	$res = "";
	switch($OP){
		case 1:{
			$RD = "-1";
			$F = $_GET["F"];
			if(file_exists($F)){
				$RD = file_get_contents($F);
			}
			$res = $RD;
			break;
		}
		default:{
			$res = "0";
			break;
		}
	}
	echo $res;
}