function Installer () {
	
}

Installer.install = function (Vue) {
	function toast(a,b,c){
		
		
		
		var od = document.createElement("div");
		od.setAttribute("style","position:fixed;top:0;right:0;width:100%;height:100%;background-color:rgba(0,0,0,0.7);z-index:99999999999;");
		od.setAttribute("id","toast");
		
		document.body.appendChild(od);
		console.log(document.getElementById("toast"))
		setTimeout(function(){
			document.getElementById("toast").parentNode.removeChild(document.getElementById("toast"));
		},2000)
		
		
		
		
	}
	
	Vue.prototype.$toast=toast;
	
	
	
	
	
	
	
	
}


export default Installer;