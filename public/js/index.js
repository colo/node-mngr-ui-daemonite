var mainBodyModel = null;

var root_page = {
	//we need this so pagerjs can bind without errors, it will call the real class method
	beforeHide: function(){},
	afterShow: function(){}
};

var Page = null;

//head.js({ PouchDB: "/public/bower/pouchdb/dist/pouchdb.min.js" }); //no dependencies

//head.ready('PouchDB', function(){
	//window.PouchDB = PouchDB;//for Chrome Fauxton
//});

//head.js({ resilient: "/public/apps/login/bower/resilient/resilient.min.js" }); //no dependencies
//head.js({ mootools: "/public/bower/mootools/dist/mootools-core.min.js" }); //no dependencies

head.js({ mootools: "/public/bower/mootools/dist/mootools-core.min.js" }, function(){
		
}); //no dependencies

head.js({ 'mootools-more': "/public/js/MooTools-More-1.6.0-compressed.js" }); //no dependencies

head.ready('mootools-more', function(){ 
	var MainModel = new Class({
		Implements: [Options, Events],
		
		INITIALIZED: 'initialized',
		ON_MODEL: 'onModel',
		
		options : {
		},
		
		initialize: function(options){
			var self = this;
			
			self.setOptions(options);
			
			self.apps = ko.observableArray(apps);
			/*
			 * apps[] updated on <body><script>...</script></body>
			 * each app is an observable of this main model, so we can use the 'with' data-binding (ex: with: login)
			 * */	
			//apps.each(function(app){
				////console.log('app');
				////console.log(app);
				//self[app.id] = ko.observable(null);
			//});
			
			self.breadcrumb = ko.observableArray([
				{ active: 'active',
					href: '/',
					item: 'Home',
				}
			]);
			
			self.apps().forEach(function(app, index){
				console.log('app observable');
				console.log(app.id);
				
				self[app.id] = ko.observable(null);
				
				self[app.id].subscribe( function(value){
					
					self.fireEvent(self.ON_MODEL+'_'+app.id, value);
					
				}.bind(this) );
				
				
				if(app['subapps']){
					Array.each(app['subapps'], function(subapp, subindex){
						console.log(subapp.with);
						
						self[subapp.with] = ko.observable(null);
						
						self[subapp.with].subscribe( function(value){
					
							self.fireEvent(self.ON_MODEL+'_'+subapp.with, value);
							
						}.bind(this) );
				
					}.bind(this));
				}
				
				if(index == self.apps().length -1){
					console.log('INITIALIZING....');
					this.fireEvent(this.INITIALIZED);
				}
			});
			
			
			
			//self.breadcrumbs = ko.observableArray([
				//{label: 'dashboard', href: '/dashboard'},
				//{label: 'second', href: '/dashboard/more'}
			//]); 
			
		},
		append_breadcrumb: function(item){
			console.log('append_breadcrumb');
			
			if(item.active == 'active'){
				var breadcrum = Object.assign([], this.breadcrumb());
				this.breadcrumb.removeAll();
				breadcrum.forEach(function(item, index){
					item.active = '';
					console.log(item);
					//this.breadcrumb()[index] = item;
					
					this.breadcrumb.push(item);
				}.bind(this));
			}		
			this.breadcrumb.push(item);
		}
	});

	//mainBodyModel = new viewModel();
	Page = new Class({
		Implements: [Options, Events],
		
		HTML_LOADED: 'jsonpLoaded',
		HTML_SUCCESS: 'jsonpSuccess',//if all HTML succesfully load
		
		JSONP_LOADED: 'jsonpLoaded',
		JSONP_SUCCESS: 'jsonpSuccess',//if all JSONP succesfully load
		
		JS_LOADED: 'jsLoaded',
		JS_SUCCESS: 'jsSuccess',//if all JS succesfully load
		
		CSS_LOADED: 'cssLoaded',
		CSS_SUCCESS: 'cssSuccess',//if all CSS succesfully load
		
		ASSETS_SUCCESS: 'assetsSuccess',
		
		STARTED: 'started',
		
		pager: null,
		model: null,
		ko: null,
		
		load_html_success: [],
		load_jsonp_success: [],
		load_css_success: [],
		load_js_success: [],
		js_assets: {},
		
		all_html_loaded: true,
		all_css_loaded: true,
		all_js_loaded: true,
		all_jsonp_loaded: true,
		all_assets_loaded: false,
		
		options: {
			assets: {
				html: {
				},
				js: {
				},
				css: {
				},
				jsonp: {
				}
			},
		},
		
		initialize: function(options){
			
			this.setOptions(options);
			
			this.addEvent(this.HTML_SUCCESS, function(){
				this.all_html_loaded = true;
				
				if(this.all_css_loaded && this.all_jsonp_loaded && this.all_js_loaded){
					this.fireEvent(this.ASSETS_SUCCESS);
				}
			}.bind(this));
			
			this.addEvent(this.JS_SUCCESS, function(){
				//console.log('this.JS_SUCCESS');
				//console.log(this.all_css_loaded);
				//console.log(this.all_jsonp_loaded);
				
				this.all_js_loaded = true;
				
				if(this.all_css_loaded && this.all_jsonp_loaded && this.all_html_loaded){
					this.fireEvent(this.ASSETS_SUCCESS);
				}
			}.bind(this));
			
			this.addEvent(this.CSS_SUCCESS, function(){
				this.all_css_loaded = true;
				
				if(this.all_js_loaded && this.all_jsonp_loaded && this.all_html_loaded){
					this.fireEvent(this.ASSETS_SUCCESS);
				}
			}.bind(this));
			
			this.addEvent(this.JSONP_SUCCESS, function(){
				this.all_jsonp_loaded = true;
				
				if(this.all_js_loaded && this.all_css_loaded && this.all_html_loaded){
					this.fireEvent(this.ASSETS_SUCCESS);
				}
			}.bind(this));
			
			if(this.options.assets && Object.getLength(this.options.assets) > 0){
				
				if(Object.getLength(this.options.assets.css) > 0){
					this.load_css(this.options.assets.css);
				}
				else{
					self.fireEvent(self.CSS_SUCCESS);
				}
				
				if(Object.getLength(this.options.assets.html) > 0){
					this.load_html(this.options.assets.html);
				}
				else{
					self.fireEvent(self.HTML_SUCCESS);
				}
				
				if(Object.getLength(this.options.assets.jsonp) > 0){
					this.load_jsonp(this.options.assets.jsonp);
				}
				else{
					self.fireEvent(self.JSONP_SUCCESS);
				}
				
				if(this.options.assets.js.length > 0){
					this.load_js(this.options.assets.js);
				}
				else{
					self.fireEvent(self.JS_SUCCESS);
				}
			}
			else{
				console.log('no assets');
				this.fireEvent(this.ASSETS_SUCCESS);
			}
			
		},
		load_html: function(assets){
			var self = this;
			this.all_html_loaded = false;
			
			Object.each(assets, function(html, id){
				console.log('load_html '+id);
				console.log(html);
				
				var req = {
					evalScripts: false,
					//evalResponse: true,
					method: 'get',
					noCache: true,
				};
				
				var append = null;
				
				if(typeOf(html) == 'object'){
					req = Object.merge(req, Object.clone(html));
					
					if(req.ko_template && req.append){
						append = req.append;
						req.append = null //we will append manually, not as a property of Request.HTML
					}
						
				}
				else{
					req.url = html;
				}
				
				console.log(req);
				
				var html_req = new Request.HTML(Object.merge(
					{
						onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript){
							
							var resp = {
								tree: responseTree,
								elements: responseElements,
								html: responseHTML,
								js: responseJavaScript
							}
							console.log('responseHTML');
							console.log(resp);
							
							if(req.ko_template && append){
								var el = new Element('script',{
									type: "text/html",
									id: id+'-template'
								});
								
								el.appendText(resp.js);
								//console.log(el);
								
								console.log(append);
								/**
								 * using $() to select the Element may cause jQuery to grab it instead of mootols - use on document.id is encouraged
								 * */
								if(!append.adopt && append.selector){
									append = document.id(append.selector);
									//console.log(append);
								}
									
								append.adopt(el);
						
							}
							
							/**
							* to keep record of succesfuly loaded html
							* */
							self.load_html_success.push(id);
					
							self.fireEvent(self.HTML_LOADED+'_'+id, resp);
							self.fireEvent(self.HTML_LOADED, {id: id, response: resp});
							
							/**
							 * compare the every key of "css" with "load_css_success", return true when all keys (css) are found
							 * 
							 * */
							var all_success = Object.keys(assets).every(function(asset){
								return (self.load_html_success.indexOf(asset) >= 0) ? true : false;
							});
							
							
							if(all_success){
								console.log('load_html_success');
								self.fireEvent(self.HTML_SUCCESS);
							}
						},
					},
					req
				));
				
				html_req.send();
				//var css = Asset.css(css, {
					//id: id,
					//onLoad: function(){
						//console.log('onLoad css '+id);
						////console.log(css);
						
						///**
						 //* to keep record of succesfuly loaded css
						 //* */
						//self.load_css_success.push(id);
				
						//self.fireEvent(self.CSS_LOADED+'_'+id, css);
						//self.fireEvent(self.CSS_LOADED, {id: id, css: css});
						
						///**
						 //* compare the every key of "css" with "load_css_success", return true when all keys (css) are found
						 //* 
						 //* */
						//var all_success = Object.keys(assets).every(function(asset){
							//return (self.load_css_success.indexOf(asset) >= 0) ? true : false;
						//});
						
						
						//if(all_success){
							//console.log('load_css_success');
							//self.fireEvent(self.CSS_SUCCESS);
						//}
						
					//}
				//});
			});
		},
		load_css: function(assets){
			var self = this;
			this.all_css_loaded = false;
			
			Object.each(assets, function(css, id){
				//console.log('load_css '+id);
				//console.log(css);
				
				var css = Asset.css(css, {
					id: id,
					onLoad: function(){
						console.log('onLoad css '+id);
						//console.log(css);
						
						/**
						 * to keep record of succesfuly loaded css
						 * */
						self.load_css_success.push(id);
				
						self.fireEvent(self.CSS_LOADED+'_'+id, css);
						self.fireEvent(self.CSS_LOADED, {id: id, css: css});
						
						/**
						 * compare the every key of "css" with "load_css_success", return true when all keys (css) are found
						 * 
						 * */
						var all_success = Object.keys(assets).every(function(asset){
							return (self.load_css_success.indexOf(asset) >= 0) ? true : false;
						});
						
						
						if(all_success){
							console.log('load_css_success');
							self.fireEvent(self.CSS_SUCCESS);
						}
						
					}
				});
			});
		},
		load_jsonp: function(assets){
			var self = this;
			
			this.all_jsonp_loaded = false;
			
			Object.each(assets, function(jsonp, id){
				console.log('jsonp');
				console.log(jsonp);
				
				if(typeof(jsonp) != 'object'){
					var url = jsonp;
					jsonp = {
						url: url,
						noCache: true,
						onRequest: function (url) {
								// a script tag is created with a 
								// src attribute equal to url
								console.log('requesting.... '+url);
						},
						onComplete: function (data) {
							/**
							 * to keep record of succesfuly loaded css
							 * */
							self.load_jsonp_success.push(id);
					
							
							
							/**
							 * compare the every key of "css" with "load_css_success", return true when all keys (css) are found
							 * 
							 * */
							var all_success = Object.keys(assets).every(function(asset){
								return (self.load_jsonp_success.indexOf(asset) >= 0) ? true : false;
							});
							
							
							if(all_success){
								console.log('load_jsonp_success');
								self.fireEvent(self.JSONP_SUCCESS);
							}
							
							self.fireEvent(self.JSONP_LOADED+'_'+id, data);
							self.fireEvent(self.JSONP_LOADED, {id: id, jsonp: data});
							// the request was completed 
							// and data received the server answer.
							//console.log(data); // answer object with data
						}
					};
					
				}
				
				var myJSONP = new Request.JSONP(jsonp).send();

			});
		},
		/**
		 * if assets = string: load file (this assets won't launch Events, nice for loading gentellela/custom.js wich needs everything applied before load)
		 * if assets = []: load each 
		 * if assets = {}: load each {id, file}
		 * if file to load = []: load each chained on event 
		 * 		Ex: second_lib will load on JS_LOADED_first_lib Event
		 *		assets:{
		 * 			complex_dependency:[
		 * 				{ first_lib: 'route_to_first_lib.js'},
		 * 				{ second_lib: 'route_to_second_lib.js'},
		 * 			]
		 * 		}
		 * 			
		 * */
		load_js: function(assets, callback){
			
			this.all_js_loaded = false;
			
			var self = this;
			if(typeOf(assets) == 'array'){
				Array.each(assets, function(js){
					console.log('Array');
					console.log(js);
					self.load_js(js);
				});
			}
			else if(typeOf(assets) == 'object'){
				
				Object.each(assets, function(js, id){
					console.log('Object');
					console.log({js: js, id:id});
					
					if(typeOf(js) == 'array'){
						Array.each(js, function(file, index){
							console.log('file Array');
							console.log(file);
							console.log(index);
							
							if(index == 0){
								self.load_js(file);
							}
							else{
								var prev = Object.keys(js[index - 1])[0];
								
								self.addEvent(self.JS_LOADED+'_'+prev, function(){
									//console.log('on '+prev+' is going to load: ');
									//console.log(file);
									
									self.load_js(file);
								});
							}
						});
					}
					else{
						
						self.js_assets = Object.merge(self.js_assets, assets);
						
						var jsFile = Asset.javascript(js, {
							id: id,
							onLoad: function(){
								/**
								* to keep record of succesfuly loaded css
								* */
								self.load_js_success.push(id);

								self.fireEvent(self.JS_LOADED+'_'+id, js);
								self.fireEvent(self.JS_LOADED, {id: id, js: js});

								/**
								* compare the every key of "css" with "load_css_success", return true when all keys (css) are found
								* 
								* */
								var all_success = Object.keys(self.js_assets).every(function(asset){
									return (self.load_js_success.indexOf(asset) >= 0) ? true : false;
								});


								if(all_success){
									console.log('load_js_success');
									console.log(self.js_assets);
									self.fireEvent(self.JS_SUCCESS);
								}
								
								 
							 },
							 
						});
					}
					
				});
			}
			else{//string
				console.log('string');
				console.log(assets);
				
				var jsFile = Asset.javascript(assets, {
					onLoad: function(){
						if(callback){
							callback.attempt(assets, this);
						}
						else{
							self.fireEvent(self.JS_LOADED, {id: null, js: assets});
						}
					},
				});
				
			}
			
			
		}
		
	});

	var RootPage = new Class({
		Extends: Page,
		
		resources: {},
		
		options: {
			assets: {
				js: [
					{ jQuery: "/public/bower/jquery/dist/jquery.min.js" },
					{	pager_deps: [
							{ ko: "/public/bower/knockoutjs/dist/knockout.js" },
							//{ jQuery: "/public/bower/jquery/dist/jquery.min.js" },
							{ pager: "/public/bower/pagerjs/dist/pager.min.js" },
							{ history: "/public/bower/history.js/scripts/bundled/html4+html5/jquery.history.js"},
						]
					},
					{ page_deps: [
						{ tether: "/public/bower/tether/dist/js/tether.js" },
						{ bootstrap: "/public/bower/bootstrap/dist/js/bootstrap.min.js"},
						//{ bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js"},
						
						{ material: "/public/bower/daemonite-material/js/material.min.js" },
						{ project: "/public/bower/daemonite-material/js/project.min.js" },
						]
					}
				],
				
			},
		},
		
		
		initialize: function(options){
			console.log('initializing root....');
			var self = this;
			
			this.addEvent(this.ASSETS_SUCCESS, function(){

				
				if(mainBodyModel == null){
					
				
					if(!self.model){
						
						
						self.model = new MainModel();
						self.addEvent(self.model.INITIALIZED,function(){
							console.log('self.model.INITIALIZED');
							
						});
						
						self.pager = pager;
						// use HTML5 history
						self.pager.useHTML5history = true;
						// use History instead of history
						self.pager.Href5.history = History;
						
						// extend your view-model with pager.js specific data
						self.pager.extendWithPage(self.model);
						
						//console.log(self.model);
						
						
						ko.applyBindings(self.model, document.getElementById("main-body"));
						pager.startHistoryJs();
							
				
						
					
						console.log('main-body binding applied');
					}
					
					mainBodyModel = self.model;
					
					//ko.tasks.schedule(this.start_timed_requests.bind(this));
					
				}
				else{
					self.model = mainBodyModel;
				}
				
				
				self.fireEvent(self.STARTED);
				
				//self.load_js("/public/bower/gentelella/build/js/custom.js");
				
			});
			
			
			this.parent(options);

		},
		beforeHide: function(pager){
			var self = this;
			var page = pager.page;
			
			self.fireEvent('beforeHide', pager);
			
			var resource = page.currentId;
			
			if(resource != ''){
				if(page.parentPage && page.parentPage.currentId)
					resource = page.parentPage.currentId+'_'+page.currentId;
					
				self.fireEvent('beforeHide_'+resource, pager);
				
				console.log('beforeHide');
				console.log(resource);
				//console.log(this);
			}
		},
		afterShow: function(pager){
			var self = this;
			var page = pager.page;
			
			self.fireEvent('afterShow', pager);
			
			var resource = page.currentId;
	
			if(resource != ''){
				if(page.parentPage && page.parentPage.currentId)
					resource = page.parentPage.currentId+'_'+page.currentId;
			
			
				self.fireEvent('afterShow_'+resource, pager);
			
				console.log('afterShow');
				console.log(page);
				console.log(resource);
				//console.log(this);
			}
		},
		load_app_resources: function(page) {//apply on pagerjs external resources
			var self = this;
			console.log('load_app_resources: ');
			console.log(self);
			//console.log(page);
			//console.log(page.pageRoute);
			//console.log(page.originalRoute());
			//console.log(page.parentPage.currentId);
			
			var resource = page.currentId+'/index.js';
			var res_key = page.currentId;
			
			if(page.parentPage && page.parentPage.currentId){
				resource = page.parentPage.currentId+'/'+page.currentId+'.js'
				res_key = page.parentPage.currentId+'_'+page.currentId;
			}
			
			//if(!self.resources)
				//self.resources = {};
			
			if(!self.resources[res_key]){
				console.log('loading....: '+ '/public/apps/'+resource);
				

				self.resources[res_key] = '/public/apps/'+resource;
				head.js(self.resources[res_key]);
			}
			
			
		},
		
	});

	root_page = new RootPage();
		

});

