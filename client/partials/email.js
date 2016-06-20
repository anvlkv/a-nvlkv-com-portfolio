Template.emailOverlay.helpers({
	dialog: function () {
		// switch dialogs here
		// if (!) {}
		return 'composeEmail'
	}
});

Template.composeEmail.helpers({
	subject: function () {
		if (Session.get('current-project')) {
			return Projects.findOne({_id:Session.get('current-project')}).title;
		} else if (Session.get('current-category')){
			return Categories.findOne({_id:Session.get('current-category')}).title;
		}
	},
});

Template.composeEmail.events({
	'click .js_clear_email': function (e, t) {
		Session.set('email-dialog-message', null);
		t.$('form')[0].reset();
		return false
	},
	'click .js_send_email, submit #emailForm': function (e, t) {
		// console.log(t.$('[name=name]')[0]);
		let message = t.$('[name=message]').val();
		let signature = 'Name: ' + t.$('[name=name]').val() + '\n URL: ' + FlowRouter.current().path;
		message = message + '\n\n'+signature;
		let msg={
			email: t.$('[name=email]').val(),
			subject: t.$('[name=subject]').val(),
			message: message
		};
		Meteor.call('sendEmail', msg, function (error, result) {
			if (error) {
				// console.log(error);
			}else{
				console.log(result);

			}
		});
		return false
	},
	'click .js_close_dialog': function () {
		Session.set('email-dialog-message', null);
		Session.set('email-dialog-open', false);
	},
	'keyup [name=message]':function (e, t){
		let message = t.$('[name=message]').val();
		Session.set('email-dialog-message', message);
	}
});