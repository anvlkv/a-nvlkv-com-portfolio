// email form
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

emailHotKeys = new Hotkeys({
	autoLoad:false
});

emailHotKeys.add({
	combo:'esc',
	callback : function(){
		GAnalytics.event('email', 'key-press', 'esc');
		email_pre_form.clear();
		Session.set('active-overlay', false);
		FlowRouter.setQueryParams({email: null});
    }
});

emailHotKeys.add({
	combo:'ctrl+enter',
	callback : function(){
		GAnalytics.event('email', 'key-press', 'ctrl+enter');
		$('#emailForm').submit();
    }
});

Template.emailOverlay.onCreated(function(){

	this.autorun(()=>{
		emailHotKeys.load();
		GAnalytics.event('email','open');
	});
});
Template.emailOverlay.onDestroyed(function(){
	emailHotKeys.unload();
});

Template.emailOverlay.helpers({
	dialog: function () {
		// switch dialogs here
		if (!Session.get('email-sent')) {
			return 'composeEmail';
		} else {
			// return 'composeEmail'		
			return 'successDialog';
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
			return 'Contact from a.nvlkv.com';
		}
	},
	message: function(){
		return email_pre_form.get('message');
	},
});

Template.composeEmail.events({
	'click .js_clear_email': function (e, t) {
		email_pre_form.clear();
		form_errors.clear();
		t.$('form')[0].reset();
		t.$('form .invalid-field').removeClass('invalid-field');
		GAnalytics.event('email', 'clear-form');
		return false;
	},
	'click .js_send_email, submit #emailForm': function (e, t) {
		GAnalytics.event('email', 'submit');
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
    				GAnalytics.event('email', 'sent');
    			}
    		});
    	} else {
    		GAnalytics.event('email', 'errors','on-submit', validation_errors.length);
    		$.each(validation_errors, function(index, val) {
    			form_errors.set(index, val);
    			t.$('[name='+ index +']').addClass('invalid-field');
    		});
    		t.$('.email-dialog').addClass('animate-error');
    	}
		return false;
	},
	'click .js_close_dialog': function () {
		GAnalytics.event('email', 'close');
		Session.set('active-overlay', false);
		FlowRouter.setQueryParams({email: null});
	},
	'blur input, blur textarea, change input, change textarea': function(e,t){
		email_pre_form.set($(e.target).attr('name'), $(e.target).val());
	}
});

Template.successDialog.events({
	'click .js_close_dialog': function () {
		GAnalytics.event('email', 'close', 'success');
		Session.set('active-overlay', false);
		FlowRouter.setQueryParams({email: null});
	},
});


Template.backCover.events({
	'click #keepInTouchEmail, submit #keepInTouchForm': function (e, t) {
		GAnalytics.event('back-cover', 'submit');
    	let msg={
    		email: t.$('[name=email]').val(),
    		subject: 'Keep in touch',
    		message: 'Keep in touch form submitted',
    		name: 'Keep in touch',
    		sentFrom: 'back-cover',
    	};
    	let validation_errors = validate(msg, constraints, {fullMessages: false});
    	if (!validation_errors) {
    		t.$('.keep-in-touch').addClass('animate-sent');
    		Meteor.call('sendEmail', msg, function (error, result) {
    			if (error) {
    				console.log(error);
    				t.$('.keep-in-touch').addClass('animate-error');
    			}else{
    				t.$('.keep-in-touch').html('<p>Thank you! I\'ll be in touch with you soon.</p>');
    				t.$('.keep-in-touch').removeClass('animate-sent').addClass('animate-in');
    				GAnalytics.event('back-cover-form', 'sent');
    			}
    		});
    	} else {
    		GAnalytics.event('back-cover', 'errors','on-submit', validation_errors.length);
    		$.each(validation_errors, function(index, val) {
    			form_errors.set(index, val);
    			t.$('[name='+ index +']').addClass('invalid-field');
    		});
    		t.$('.keep-in-touch').addClass('animate-error');
    	}
		return false;
	}
});


// forms basic

Template.formField.onRendered(function(){
	if (this.data.value) {
		this.$('label').addClass('in-use');
	}
});

Template.formField.helpers({
	inputType: function(){
		switch(this.type){
			case 'textarea':
				return 'formTextarea';
			case 'checkbox':
				return 'formCheckbox';
			default:
				return 'formInput';
		}
	}
});

Template.formField.events({
	'focus input, focus textarea': function(e,t){
		// console.log($(e.target));
		$(e.target).closest('label').addClass('in-use');
	},
	'blur input, blur textarea, change input, change textarea': function(e,t){
		// email_pre_form.set($(e.target).attr('name'), $(e.target).val());
		if (!$(e.target).val()) {
			$(e.target).closest('label').removeClass('in-use');
		}
	},
	'blur input, blur textarea, keyup .invalid-field': function (e,t) {
		let val = $(e.target).val(),
			name = $(e.target).attr('name');
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

Template.formCheckbox.events({
	'click #checkbox-bounds': function (e, t) {
		let checkmark = Snap(t.$('#checkmark')[0]),
			pts_checkmark_semi = Snap(t.$('#checkmark-semi-checked')[0]).attr('points'),
			pts_checkmark_checked = Snap(t.$('#checkmark-checked')[0]).attr('points'),
			pts_checkmark_unchecked = Snap(t.$('#checkmark-unchecked')[0]).attr('points');

		if (t.$('#checkbox-input:checked')[0]) {

			t.$('#checkbox-frame polygon').each(function(index, el) {
				let frame = Snap(el);
				let pts_initial_frame = frame.attr('points');
				let pts_final_frame = Snap(t.$('#checkbox-frame-unchecked polygon#'+$(el).attr('id'))[0]).attr('points');
				// console.log(pts_initial_frame, pts_final_frame);
				Snap.animate(pts_initial_frame, pts_final_frame, function(val){
					if(val)
						frame.attr('points', val);
				}, 250, mina.easein);
			});

			Snap.animate(pts_checkmark_checked, pts_checkmark_semi,function(val){
				if(val)
					checkmark.attr('points', val);
			}, 125, mina.easeout, function(){
				Snap.animate(pts_checkmark_semi, pts_checkmark_unchecked, function(val){
					if(val)
						checkmark.attr('points', val);
				}, 125, mina.easeout);
			});

		}else{

			t.$('#checkbox-frame polygon').each(function(index, el) {
				let frame = Snap(el);
				let pts_initial_frame = frame.attr('points');
				let pts_final_frame = Snap(t.$('#checkbox-frame-checked polygon#'+$(el).attr('id'))[0]).attr('points');
				// console.log(pts_initial_frame, pts_final_frame);
				Snap.animate(pts_initial_frame, pts_final_frame, function(val){
					if(val)
						frame.attr('points', val);
				}, 250, mina.easein);
			});
			Snap.animate(pts_checkmark_unchecked, pts_checkmark_semi,function(val){
				if(val)
					checkmark.attr('points', val);
			}, 125, mina.easeout, function(){
				Snap.animate(pts_checkmark_semi, pts_checkmark_checked, function(val){
					if(val)
						checkmark.attr('points', val);
				}, 125, mina.easeout);
				
			});

		}

		t.$('#checkbox-input').prop('checked', !t.$('#checkbox-input').prop('checked'));

		return false;
	}
});