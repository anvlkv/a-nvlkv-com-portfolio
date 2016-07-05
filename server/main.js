import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  process.env.MAIL_URL = 'smtp://utils.a.nvlkv%40gmail.com:bE%5BC%7B%3E%2BjPL%7BW9%25HC@smtp.gmail.com:465';

  // remove for production
  if (Meteor.users.find().count()<1) {
  	Accounts.createUser({
  	username:"test",
  	email:"test@test.com",
  	password:"test123"});
  }

});
