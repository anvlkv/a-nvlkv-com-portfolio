let constraints = {
	name:{
		presence: {
			message: 'Please introduce yourself'
		},
		length:{
			minimum: 1,
			message: 'Please introduce yourself'
		}
	},
	email:{
		email: {
			message: 'Please provide a valid email address'
		},
		presence: {
			message: 'Please provide a valid email address'
		},
	},
	subject:{
		presence: {
			message: 'Please tell me what is it all about'
		},
		length:{
			maximum: 200,
			message: 'No more than 200 symbols, please'	
		}
	},
	message:{
		presence:{
			message: 'Please say something'
		}
	}
};

let email_pre_form = new ReactiveDict('email_pre_form');
let form_errors = new ReactiveDict();

Template.emailOverlay.onRendered(function(){
	Session.set('email-sent', false);
});



Template.emailOverlay.helpers({
	dialog: function () {
		// switch dialogs here
		if (!Session.get('email-sent')) {
			return 'composeEmail'		
		} else {
			// return 'composeEmail'		
			return 'successDialog'
		}
	}
});

Template.composeEmail.helpers({
	name: function(){
		return email_pre_form.get('name');
	},
	email: function(){
		return email_pre_form.get('email');
	},
	subject: function () {
		if (email_pre_form.get('subject')) {
			return email_pre_form.get('subject');
		} else if (Session.get('current-project')) {
			return Projects.findOne({_id:Session.get('current-project')}).title;
		} else if (Session.get('current-category')){
			return Categories.findOne({_id:Session.get('current-category')}).title;
		} else {
			return 'Contact from a.nvlkv.com'
		}
	},
	message: function(){
		return email_pre_form.get('message');
	},
});

Template.composeEmail.events({
	'click .js_clear_email': function (e, t) {
		email_pre_form.clear();
		t.$('form')[0].reset();
		return false
	},
	'click .js_send_email, submit #emailForm': function (e, t) {
    	let msg={
    		email: t.$('[name=email]').val(),
    		subject: t.$('[name=subject]').val(),
    		message: t.$('[name=message]').val(),
    		name: t.$('[name=name]').val(),
    		sentFrom: FlowRouter.current().path,
    	};
    	let validation_errors = validate(msg, constraints, {fullMessages: false});
    	if (!validation_errors) {
    		t.$('.email-dialog').addClass('animate-sent');
    		Meteor.call('sendEmail', msg, function (error, result) {
    			if (error) {
    				console.log(error);
    				t.$('.email-dialog').addClass('animate-error');
    			}else{
    				email_pre_form.delete('message');
    				Session.set('email-sent', true);
    			}
    		});
    	} else {
    		$.each(validation_errors, function(index, val) {
    			form_errors.set(index, val);
    			t.$('[name='+ index +']').addClass('invalid-field');
    		});
    		t.$('.email-dialog').addClass('animate-error');
    	}
		return false
	},
	'click .js_close_dialog': function () {
		Session.set('email-dialog-open', false);
	},
});

Template.successDialog.events({
	'click .js_close_dialog': function () {
		Session.set('email-dialog-open', false);
	},
});


// tiny pieces

Template.formField.helpers({
	isTextarea: function (type) {
		if (type == 'textarea') {
			return true
		}
	}
});

Template.formField.events({
	'focus input, focus textarea': function(e,t){
		$(e.target).parent('label').addClass('in-use');
	},
	'blur input, blur textarea': function(e,t){
		if (!$(e.target).val()) {
			$(e.target).parent('label').removeClass('in-use');
		}
	},
	'keyup input, keyup textarea':function (e, t){
		email_pre_form.set($(e.target).attr('name'), $(e.target).val());
	},
	'blur input, blur textarea, keyup .invalid-field': function (e,t) {
		let val = $(e.target).val()
		let name = $(e.target).attr('name');
		let validation_errors = validate.single(val, constraints[name]);
		if (!validation_errors) {
			$(e.target).removeClass('invalid-field');
			form_errors.delete(name);
		} else {
			$(e.target).addClass('invalid-field');
			form_errors.set(name, validation_errors);
		}
	},
});

Template.formError.helpers({
	errors: function(name){
		return form_errors.get(name);
	}
});