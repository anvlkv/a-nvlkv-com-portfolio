Template.pageOverlay.helpers({
	overlay: function () {
		const route = FlowRouter.current();
		// reset if both params
		if (route.queryParams.menu && route.queryParams.email) {
			FlowRouter.go(route.route.name, route.params);
		}
		// manage overlays
		if (Session.get('active-overlay')==='consent') {
			// consent for cookies and experiment
			return 'consentOverlay';

		}else if (route.queryParams.menu || Session.get('active-overlay')==='menu') {
			if (route.route.name == 'home') {
				FlowRouter.setQueryParams({menu:null});
			} else {
				if (Session.get('active-overlay')!='menu') {
					Session.set('active-overlay', 'menu');
				}
				if (!route.queryParams.menu) {
					FlowRouter.go(route.route.name, route.params, {menu:true});
				}	

				return 'menuOverlay';
			}
			
		} else if (route.queryParams.email || Session.get('active-overlay')==='email'){
			if (Session.get('active-overlay') != 'email') {
				Session.set('active-overlay', 'email');
			}
			if (!route.queryParams.menu) {
				FlowRouter.go(route.route.name, route.params, {email:true});
			}	

			return 'emailOverlay';

		} else if (Session.get('active-overlay')==='hint'){
			
			return 'hintOverlay';
		}
	}
});