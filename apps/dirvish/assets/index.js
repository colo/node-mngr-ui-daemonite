var dirvish_page = null;

head.ready('mootools-more'
, function() {
	
	var DirvishPage = new Class({
		Extends: Page,
		
		options: {
			assets: {
				js: [
					{ model: "/public/apps/dirvish/models/index.js" },
					//{ li: "/public/bower/li/lib/index.js" },
					//{ resilient: "/public/bower/resilient/resilient.min.js" },
					//{ crypto: "/public/apps/login/bower/cryptojslib/rollups/sha1.js" }
				],
				css: {
					//login_css: '/public/apps/login/css/index.css',
					////dns_css: '/public/apps/dns/index.css',
					////green_css: '/public/bower/gentelella/vendors/iCheck/skins/flat/green.css'
				}
			},
		},
		
		initialize: function(options){
			var self = this;
			
			this.addEvent(this.ASSETS_SUCCESS, function(){
				console.log('dirvish_page.ASSETS_SUCCESS');
				self.fireEvent(self.STARTED);
			});
							
			this.addEvent(this.STARTED, function(){
					
				if(mainBodyModel.dirvish() == null){
					
					if(!self.model){
						self.model = new DirvishModel();
						//window.mdc.autoInit();
						console.log('dirvish binding applied');
					}
					
					mainBodyModel.dirvish(self.model);
					
					mainBodyModel.append_breadcrumb({
						active: 'active',
						href: '/dirvish',
						item: 'Dirvish',
					});
					
					//ko.tasks.schedule(this.start_timed_requests.bind(this));
					
				}
				else{
					self.model = mainBodyModel.dirvish();
				}
					
			});
			
			

			
			this.parent(options);
			
			
		}
		
	});

	if(mainBodyModel){
		console.log('mainBodyModel');
		dirvish_page = new DirvishPage();
	}
	else{
		console.log('no mainBodyModel');
		
		root_page.addEvent(root_page.STARTED, function(){									
			dirvish_page = new DirvishPage();
		});
	}	
	
	
});
