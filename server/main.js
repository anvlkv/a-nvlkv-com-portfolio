import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	// code to run on server at startup
	process.env.MAIL_URL = Meteor.settings.admin.mailUrl;

	// remove for production
	if (Meteor.users.find().count()<1) {
		Accounts.createUser({
		username:Meteor.settings.admin.user,
		email:Meteor.settings.admin.email,
		password:Meteor.settings.admin.password
		});
	}
	
	ABTestServer.adminIds=[];

	Meteor.users.find().forEach(function (user) {
		ABTestServer.adminIds.push(user._id);
	});

});