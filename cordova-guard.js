/**
* Cordova Guard
*	A JavaScript based access control solution for protecting
*	Cordova JavaScript APIs against malicious JavaScript codes
*
* Author		Ali Reza Barkhordari
* Start Date	Saturday 26 September 2015 
* 
* Copyright Ali Reza Barkhordari 2016
*/

;(function(window){
	
	function moduleMappingCompleted(){
		//TODO: Iterate through clobbers and wrap them in a new function applying access control mechanisms
		
		// Prevent others from calling these methods once again
		delete window.cordovaGuard;
	}
	
	var cordovaGuard = {
		onModuleMapComplete: moduleMappingCompleted
	};
	
	window.cordovaGuard = cordovaGuard;
	
})(window);