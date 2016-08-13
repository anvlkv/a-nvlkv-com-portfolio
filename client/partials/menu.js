Template.categoryLevelMenu.onCreated(function() {
	this.autorun(()=>{
		this.ready.set(Categories.find().count()>0 && currentState.get('category-id'));
	})
});
Template.projectLevelMenu.onCreated(function(){
	this.autorun(()=>{
		// console.log(currentState.get('project-id'));
		this.ready.set(Projects.find().count()>0 && Categories.find().count()>0 && currentState.get('project-id'));
	})
});
Template.yearLevelMenu.onCreated(function(){
	this.autorun(()=>{
		this.ready.set(CC_Years.find().count()>0 && currentState.get('year'));
	})
});

Template.dateLevelMenu.onCreated(function(){
	this.autorun(()=>{
		this.ready.set(CC_Years.find().count()>0 && Projects.find().count()>0 && currentState.get('project-id'));
	})
});

Template.datePageLevelMenu.onCreated(function(){
	this.autorun(()=>{
		this.ready.set(CC_Years.find().count()>0 && CC_Projects_unpublishedFields.find().count()>0 && currentState.get('project-page-slug'));
	})
});

Template.projectPageLevelMenu.onCreated(function(){
	this.autorun(()=>{
		this.ready.set(Categories.find().count()>0 && CC_Projects_unpublishedFields.find().count()>0 && currentState.get('project-page-slug'));
	})
});

Template.menuActions.onCreated(function(){
	this.menuHotKeys = new Hotkeys({
		autoLoad:false
	});

	this.menuHotKeys.add({
		combo:'s',
		callback : function(){
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay') {
				FlowRouter.setQueryParams({searchOverlay: true});
			}
	    }
	});
	this.menuHotKeys.add({
		combo:'e',
		callback : function(){
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay') {
				FlowRouter.setQueryParams({emailOverlay: true});
			}
	    }
	});
});

Template.menuActions.onRendered(function(){
	this.menuHotKeys.load();
});

Template.menuActions.onDestroyed(function(){
	this.menuHotKeys.unload();
});

Template.projectLevelMenu.helpers({
	color: function () {
		let color,
			cat=currentState.get('category-id'), 
			yr=currentState.get('year');
		if (cat) {
			let category = Categories.findOne(cat);
			if (category) {
				color =  category.color;			
			}
		} else if (yr) {
			let year = CC_Years.findOne({year:yr});
			if (year) {
				color =  year.color;
			}
		}

		return color;
	}
});
Template.yearLevelMenu.inheritsHelpersFrom('projectLevelMenu');
Template.dateLevelMenu.inheritsHelpersFrom('projectLevelMenu');
Template.projectPageLevelMenu.inheritsHelpersFrom('projectLevelMenu');
Template.datePageLevelMenu.inheritsHelpersFrom('projectLevelMenu');

Template.topLevelMenu.helpers({
	isCurrentPage: function (page) {
		let path = FlowRouter.getRouteName();
		if (path.indexOf(page) >= 0 ) {
			return true;
		}
	}
});

Template.categoryLevelMenu.helpers({
	categories: function () {
		return Categories.find({},{sort:{order:1}});
	},
	isCurrentCategory: function(slug){
		return slug == FlowRouter.getParam('category');
	},
});

Template.categoryLevelDropdown.helpers({
	categories: function () {
		return Categories.find({},{sort:{order:1}});
	},
	isCurrentCategory: function(slug){
		return slug == FlowRouter.getParam('category');
	},
});


Template.yearLevelMenu.helpers({
	years: function () {
		return CC_Years.find();
	},
	isCurrentYear: function(year){
		return year == FlowRouter.getParam('year');
	}
});

Template.yearsLevelDropdown.helpers({
	years: function () {
		return CC_Years.find();
	},
	isCurrentYear: function(year){
		return year == FlowRouter.getParam('year');
	}
});

Template.projectLevelDropdown.helpers({
	projects: function () {
		if (currentState.get('category-id')) {
			return Projects.find({primaryCategory:currentState.get('category-id')});
		}else if (currentState.get('year')){
			let prj = CC_Years.findOne({year: currentState.get('year')}).projects;
			return Projects.find({_id:{$in:prj}});
		}
	},
	isCurrentProject: function (project){
		return project == FlowRouter.getParam('project');
	},
	url: function(project) {
		if (FlowRouter.getParam('category')) {
			let params = {
				project: project.slug,
				category: Categories.findOne({_id:project.primaryCategory}).slug
			};

			return FlowRouter.path('portfolio.project', params);

		} else if (FlowRouter.getParam('year')) {

			let params = {
				project: project.slug,
				year: moment(project.endDate).format('YYYY'),
			};

			return FlowRouter.path('portfolio.date', params);
		}
		
	}
});

Template.projectPageLevelDropdown.helpers({
	pages: function () {
		let project = CC_Projects_unpublishedFields.findOne(currentState.get('project-id'));

		if (project && project.pages) {
			return project.pages;
		}
	},
	isCurrentPage: function(page){
		return page == FlowRouter.getParam('page');
	},
	url: function (page){
		let params = FlowRouter.current().params;
		params.page = page.slug;
		return FlowRouter.path(FlowRouter.getRouteName(), params);
	}
});


Template.topLevelMenu.events({
	'click .js_email_me': function () {
		FlowRouter.setQueryParams({emailOverlay:true});
	}
});


Template.navigationWrap.onRendered(function(){
	if (Meteor.Device.isPhone() || Meteor.Device.isTablet()) {
		this.$('.dropdown').on('dropdownclosed', (event)=> {
			this.$('.navigation-wrap').removeClass('menu-open');
			// console.log(event);
		});
		
		this.$('.dropdown').on('dropdownopen', (event)=> {
			this.$('.navigation-wrap').addClass('menu-open');
			// console.log(event);
		});
	}
});