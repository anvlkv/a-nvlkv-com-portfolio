Template.portfolio.helpers({
	projects: function () {
		var projects = Projects.find({});
		return projects
	},
	categories: function () {
		return Categories.find({});
	},

});

Template.projectPage.helpers({
	dateRef: function () {
		console.log(this);
	},
});