Template.pageOverlay.helpers({
	overlay: function () {
		let route = FlowRouter.current();
		let overlay = Session.get('active-overlay');
		// reset if both params
		if (route.queryParams.menu && route.queryParams.email) {
			FlowRouter.go(route.route.name, route.params);
		}
		// manage overlays
		if (route.queryParams.menu || overlay==='menu') {
			if (route.route.name == 'home') {
				FlowRouter.setQueryParams({menu:null});
			} else {
				if (overlay!='menu') {
					Session.set('active-overlay', 'menu');
				}
				if (!route.queryParams.menu) {
					FlowRouter.go(route.route.name, route.params, {menu:true});
				}	

				return 'menuOverlay';
			}
			
		} else if (route.queryParams.email || overlay==='email'){
			if (overlay != 'email') {
				Session.set('active-overlay', 'email');
			}
			if (!route.queryParams.menu) {
				FlowRouter.go(route.route.name, route.params, {email:true});
			}	

			return 'emailOverlay';

		} else if (overlay==='hint'){
			
			return 'hintOverlay';
		}
	}
});

