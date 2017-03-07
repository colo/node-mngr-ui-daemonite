var DirvishModel = new Class({
	Implements: [Options, Events],
	
	initialize: function(options){
		
		this.setOptions(options);
		this.key = "value";
		
	}
});

/**
 * http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/
 * 
 * */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = DirvishModel;
}
else {
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return DirvishModel;
		});
	}
	else {
		window.DirvishModel = DirvishModel;
	}
}
