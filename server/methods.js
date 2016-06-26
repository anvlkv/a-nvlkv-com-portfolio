Meteor.methods({
	sendEmail: function (msg) {
		// validate msg and email
		// console.log(msg);

		check(msg, {
			email: ValidEmail,
			subject: String,
			message: String,
			name: String,
			sentFrom: String
		});

		Email.send({
			to: 'a.nvlkv@gmail.com',
			from: msg.email,
			replyTo: msg.email,
			subject: msg.subject,
			text: msg.message + '\n Name: ' + msg.name + '\n url: ' + msg.sentFrom,
		});

		return EmailMessages.insert(msg);
	}
});