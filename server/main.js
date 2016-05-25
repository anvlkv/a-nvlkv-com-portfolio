import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup


  // remove for production
  if (Meteor.users.find().count()<1) {
  	Accounts.createUser({
  	username:"anvlkv",
  	email:"a.nvlkv@gmail.com",
  	password:"test123"});
  }

});
