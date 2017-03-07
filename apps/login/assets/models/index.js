var LoginModel = new Class({
	Implements: [Options, Events],
	
	options : {
	},
					
	initialize: function(options){
		var self = this;
		
		self.setOptions(options);
		//Cookie.options = {domain : '192.168.0.80:8080'};
			
		//var error = Cookie.read('bad') || false;
		
	
		//self.clearpasswordname = Math.random().toString(36).substring(7);
		
		//self.error = ko.observable(error);
		
		//self.name = "Hola";
	
		self.clearpassword = ko.observable();
		
		self.password = ko.observable(null);
		
		console.log('----');
		
		self.submit = function(form){
			console.log(form.clearpassword.value);
			
			//console.log(self.clearpassword());
			
			var hash = CryptoJS.SHA1(form.clearpassword.value);
			console.log(hash.toString());
			
			self.password(hash.toString());
			
			//console.log(self.password());
			
			//form.clearpassword.value = "";
			
			//console.log(window.location.host);
		
			var servers = [
				window.location.protocol+'//'+window.location.host
			];
			var client = resilient({
				 service: { 
					 basePath: '/login/api',
					 headers : { "Content-Type": "application/json" },
					 data: { "username": form.username.value, "password": form.password.value }
				 }
			 });
			client.setServers(servers);
			

			client.post('/', function(err, res){
				if(err){
					console.log('Error:', err);
					console.log('Response:', err.data);
				}
				else{
					//console.log('Ok:', res);
					//console.log('Body:', res.data);
					//console.log(li.parse(res.headers.Link));
					
					window.location.replace(li.parse(res.headers.Link).next);
					
					
				}
			});
	
			return false;//don't submit
		};
	},

});

/**
 * http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/
 * 
 * */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = LoginModel;
}
else {
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return LoginModel;
		});
	}
	else {
		window.LoginModel = LoginModel;
	}
}

$( document ).ready(function() {
    // DOM ready

    // Test data
    /*
     * To test the script you should discomment the function
     * testLocalStorageData and refresh the page. The function
     * will load some test data and the loadProfile
     * will do the changes in the UI
     */
    // testLocalStorageData();
    // Load profile if it exits
    //loadProfile();
});

/**
 * Function that gets the data of the profile in case
 * thar it has already saved in localstorage. Only the
 * UI will be update in case that all data is available
 *
 * A not existing key in localstorage return null
 *
 */
function getLocalProfile(callback){
    var profileImgSrc      = localStorage.getItem("PROFILE_IMG_SRC");
    var profileName        = localStorage.getItem("PROFILE_NAME");
    var profileReAuthEmail = localStorage.getItem("PROFILE_REAUTH_EMAIL");

    if(profileName !== null
            && profileReAuthEmail !== null
            && profileImgSrc !== null) {
        callback(profileImgSrc, profileName, profileReAuthEmail);
    }
}

/**
 * Main function that load the profile if exists
 * in localstorage
 */
function loadProfile() {
    if(!supportsHTML5Storage()) { return false; }
    // we have to provide to the callback the basic
    // information to set the profile
    getLocalProfile(function(profileImgSrc, profileName, profileReAuthEmail) {
        //changes in the UI
        $("#profile-img").attr("src",profileImgSrc);
        $("#profile-name").html(profileName);
        $("#reauth-email").html(profileReAuthEmail);
        $("#inputEmail").hide();
        $("#remember").hide();
    });
}

/**
 * function that checks if the browser supports HTML5
 * local storage
 *
 * @returns {boolean}
 */
function supportsHTML5Storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

/**
 * Test data. This data will be safe by the web app
 * in the first successful login of a auth user.
 * To Test the scripts, delete the localstorage data
 * and comment this call.
 *
 * @returns {boolean}
 */
function testLocalStorageData() {
    if(!supportsHTML5Storage()) { return false; }
    localStorage.setItem("PROFILE_IMG_SRC", "//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120" );
    localStorage.setItem("PROFILE_NAME", "César Izquierdo Tello");
    localStorage.setItem("PROFILE_REAUTH_EMAIL", "oneaccount@gmail.com");
}
