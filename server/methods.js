Meteor.methods({
	sendEmail: function (msg) {
		// validate msg and email
		if (msg.email) {
			let result = {};
			this.unblock();
			
			result.email = Email.send({
				to: 'a.nvlkv@gmail.com',
				from: msg.email,
				replyTo: msg.email,
				subject: msg.subject,
				text: msg.message
			});

			result.backup = EmailMessages.insert(msg);

			return result;
		}
	}
});