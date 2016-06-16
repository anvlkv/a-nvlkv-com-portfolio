import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
// import { EJSON } from 'meteor/ejson';


import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });


Template.registerHelper('log',(item)=>{
	console.log(item);
	// return item
})

Template.registerHelper('globalPallet',()=>{
	return {
		utility: '#B367F7',
		cta: '#677CF7',
		history: '#d555ac',
		interactive:'#c4e059',
	}
})

Template.registerHelper('session',(input)=>{
	return Session.get(input);
})