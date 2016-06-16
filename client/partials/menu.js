Template.navMenu.helpers({
	letters: function (){
		let category = Categories.findOne(Session.get('current-category'));
		if (category) {
			return category.shortCut
		}
		return 'Menu'
	},
});

Template.menuContent.helpers({
	categories: function () {
		return Categories.find({},{sort:{order:1}});
	},
	projects: function (category){
		return Projects.find({primaryCategory:category._id},{sort:{order:1}});
	},
	url: function (project, category){
		if (project && category) {
			let params = {
				category: category.slug,
				project: project.slug
			}
			return FlowRouter.path('portfolio.project', params);
		} else if (category) {
			let params = {
				category: category.slug,
			}
			return FlowRouter.path('portfolio.category', params);
		}
	},
});


Template.navMenu.events({
	'click .js_toggle_menu': function (e,t) {
		if (!Session.get('menu-open')) {
			Session.set('menu-open', true);		
		} else {
			Session.set('menu-open', false);
		}
	},
});

Template.menuContent.events({
	'click .js_close_menu': function () {
		Session.set('menu-open', false);
	},
	'click .js_project_link': function () {
		Session.set('menu-open', false);
	},
	'click .js_category_link': function () {
		Session.set('menu-open', false);
	},
	'click .js_main_nav_link': function () {
		Session.set('menu-open', false);
	},
	
});