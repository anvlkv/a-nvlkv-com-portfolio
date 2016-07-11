import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
// import { jQery } from 'meteor/jquery';
import 'jquery-selectorator';

// import { EJSON } from 'meteor/ejson';


import './main.html';


Template.onCreated(function(){
	this.ready = new ReactiveVar();
});


Template.registerHelper('log',(item)=>{
	console.log(item);
	// return item
});

Template.registerHelper('session',(input)=>{
	return Session.get(input);
});

Template.registerHelper('readiness',()=>{
	return Template.instance().ready.get();
});


Deps.autorun(function(){
	let location='';
	if (Session.get('current-page-title')) {
		location = Session.get('current-page-title');
		location = location.toLowerCase();
	}else{
		location = FlowRouter.getRouteName();
	}

	document.title = 'a.nvlkv — ' + location;
});

Template.body.events({
	'click .item': function (e) {
		let intended_target = $(e.target).children('a');
		if (intended_target.length === 1) {
			intended_target[0].click();
		}
	},
	'click': function(e){
		GAnalytics.event(FlowRouter.current().route.name, 'click', $(e.target).getSelector().toString());
		return e;
	}
});

