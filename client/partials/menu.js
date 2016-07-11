menuHotKeys = new Hotkeys({
	autoLoad:false
});

menuHotKeys.add({
	combo:'esc',
	callback : function(){
		GAnalytics.event('menu','key-press', 'esc');
		Session.set('active-overlay', false);
		FlowRouter.setQueryParams({menu: null});
    }
});

Template.menuOverlay.onCreated(function(){
	this.autorun(()=>{
		this.subscribe('CategoriesList');
		this.subscribe('ProjectsFeed');
		menuHotKeys.load();

		GAnalytics.event('menu', 'open');
	});
});

Template.menuOverlay.onDestroyed(function(){
	menuHotKeys.unload();
});

Template.navMenu.helpers({
	letters: function (){
		let category = Categories.findOne(Session.get('current-category'));
		if (category) {
			return category.shortCut;
		}
		return 'Menu';
	},
});

Template.menuOverlay.helpers({
	categories: function () {
		return Categories.find({},{
			sort:{order:1},
			transform: function(doc){
					doc.titleShort = doc.title.substring(doc.shortCut.length , doc.title.length);
				return doc;
			}
		});
	},
	projects: function (category){
		return Projects.find({primaryCategory:category._id},{sort:{order:1}});
	},
	url: function (project, category){
		if (project && category) {
			let params = {
				category: category.slug,
				project: project.slug
			};
			return FlowRouter.path('portfolio.project', params);
		} else if (category) {
			let params = {
				category: category.slug,
			};
			return FlowRouter.path('portfolio.category', params);
		}
	},
});

Template.topLevelMenu.helpers({
	isCurrentPage: function (page) {
		let path = FlowRouter.current().route.name;
		if (path.indexOf(page) >= 0 ) {
			return true;
		}
	}
});

Template.navMenu.events({
	'click .js_toggle_menu': function (e,t) {
		Session.set('active-overlay', 'menu');
		return false;
	},
	'click .js_email_me': function(e,t) {
		Session.set('active-overlay', 'email');
		return false;
	}
});

Template.menuOverlay.events({
	'click .js_close_menu': function () {
		GAnalytics.event('menu', 'close');
		let route = FlowRouter.current();
		FlowRouter.go(route.route.name, route.params, {});
		Session.set('active-overlay', false);
		return false;
	},
	'click .js_menu_link': function(e) {
		GAnalytics.event('menu', 'go', $(e.target).attr('href'));
		Session.set('active-overlay', false);
		return e;
	}
});

Template.topLevelMenu.events({
	'click .js_email_me': function () {
		Session.set('active-overlay', 'email');
	}
});