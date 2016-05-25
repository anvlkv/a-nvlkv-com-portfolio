Template.navMenu.events({
	'click .js_toggle_menu': function (e,t) {
		t.$('.menu-content').toggleClass('in');
	},
	'click .js_project_link': function (e,t) {
		t.$('.menu-content').toggleClass('in');
	},
});

Template.navMenu.helpers({
	categories: function () {
		return Categories.find({},{sort:{order:1}});
	},
	projects: function (category){
		return Projects.find({primaryCategory:category._id},{sort:{order:1}});
	},
	url: function (project, category){
		let params = {
			category: category.slug,
			project: project.slug
		}
		return FlowRouter.path('portfolio.project', params);
	}
});