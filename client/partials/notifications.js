Template.notifications.helpers({
	notification: function () {
		return Session.get('active-notification');
	}
});

Template.cookieNotification.onRendered(function(){
	Consent.set('cookies', true);
});

Template.cookieNotification.events({
	'click .js_withdraw': function () {
		// optOut();
		window['ga-disable-'+Meteor.settings.public.ga.account] = true;
		Cookie.clearAll();
		Consent.set('cookies', false);
		Session.set('active-notification', false);
		return false;
	},
	'click .js_close': function () {
		// optOut();
		Consent.set('cookies', true);
		Session.set('active-notification', false);
		return false;
	},
});