
/**
* Cordova Guard
*	A JavaScript based access control solution for protecting
*	Cordova JavaScript APIs against malicious JavaScript codes
*
* Author		Ali Reza Barkhordari
*				abarkhordari@ce.sharif.edu
*				
* Start Date	Saturday 26 September 2015 
* 
* Copyright Ali Reza Barkhordari 2016
*/

/*
* Note:
* This JS file should be included after cordova.js in index.html by hybrid app developer.
*/

;(function(){
	var Client = null,
		waitingList = [];

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady(){
		Client = window._CordovaClient;
		delete window._CordovaClient;
		serviceWaitingList();
	}

	function serviceWaitingList(){
		var i;

		for(i = 0; i < waitingList.length; i += 1){
			var item = waitingList[i],
				callback = item.callback,
				script = item.script,
				parent = item.parent,
				permissions = item.permissions;

			callback(new Client(script, parent, permissions));
		}
	}

	function requestCordovaClient(callback, parent, permissions){
		var script = document.currentScript;		
	
		if(Client != null){
			callback(new Client(script, parent, permissions));
		} else {
			waitingList.push({
				callback: callback,
				script: script,
				parent: parent,
				permissions: permissions
			});
		}
	}

	window.requestCordovaClient = requestCordovaClient;

})();
