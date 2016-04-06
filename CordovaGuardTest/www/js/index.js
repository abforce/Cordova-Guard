requestCordovaClient(function(client){
	if(client.device){
		document.getElementById('info1').innerHTML = 'Platfrom : ' + client.device.platform;		
	} else {
		document.getElementById('info1').innerHTML = 'device plugin is not accessible';				
	}		
});
