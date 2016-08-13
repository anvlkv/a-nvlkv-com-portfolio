Template.pageOverlay.onCreated(function(){
	this.overlayHotKeys = new Hotkeys({
		autoLoad:false
	});

	this.overlayHotKeys.add({
		combo:'esc',
		callback : function(){
			if (Session.get('active-overlay')) {
				GAnalytics.event(Session.get('active-overlay'), 'key-press', 'esc');
				let params = {};
				params[Session.get('active-overlay')] = null;
				FlowRouter.setQueryParams(params);
				Session.set('active-overlay', false);
			}			
	    }
	});
});

Template.pageOverlay.onRendered(function(){
	this.autorun(()=>{
		this.overlayHotKeys.load();
	});
});

Template.pageOverlay.onDestroyed(function(){
	this.overlayHotKeys.unload();
});

Template.pageOverlay.helpers({
	overlay: function () {
		FlowRouter.watchPathChange();

		let overlay;
		let queryParams = FlowRouter.current().queryParams;

		if (Object.keys(queryParams).length > 0){
			overlay = Object.keys(queryParams)[0];
			Session.set('active-overlay', overlay);
		} else {
			overlay = null;
			Session.set('active-overlay', false);
		}

		return overlay;
	}
});

Template.pageOverlay.events({
	'click .js_close_overlay': function () {
		let params = {};
		params[Session.get('active-overlay')] = null;
		FlowRouter.setQueryParams(params);
		Session.set('active-overlay', false);
	}
});

