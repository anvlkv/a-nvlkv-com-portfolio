Template.pageOverlay.helpers({
	overlay: function () {
		const route = FlowRouter.current();
		if (route.queryParams.menu && route.queryParams.email) {
			FlowRouter.go(route.route.name, route.params);
		}
		if (route.queryParams.menu || Session.get('menu-open')) {
			if (route.route.name == 'home') {
				Session.set('menu-open', false);
				FlowRouter.setQueryParams({menu:null});
			} else {
				if (!Session.get('menu-open')) {
					Session.set('menu-open', true);
				}
				if (!route.queryParams.menu) {
					FlowRouter.go(route.route.name, route.params, {menu:true});
				}	

				return 'menuOverlay';
			}
			
		} else if (route.queryParams.email || Session.get('email-dialog-open')){
			if (!Session.get('email-dialog-open')) {
				Session.set('email-dialog-open', true);
			}
			if (!route.queryParams.menu) {
				FlowRouter.go(route.route.name, route.params, {email:true});
			}	

			return 'emailOverlay';
		}
	}
});