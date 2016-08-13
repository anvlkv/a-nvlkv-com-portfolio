// manage CRUD redirects
function crudRedirect (intent, type, formId, id){
	switch (intent){
		case 'save':
			FlowRouter.go('/admin/portfolio');
			break;
		case 'save_add':
			FlowRouter.go('/admin/portfolio/new-'+type);
			AutoForm._forceResetFormValues(formId);
			break;
		case 'save_edit':
			FlowRouter.go('/admin/portfolio/edit-' + type + '/' + id);
			break;
		default:
			FlowRouter.go('/admin/portfolio');
			break;
	}
}


// prerequisits

Template.dashboard.onCreated(function(){
	Session.set('saveIntent');
	// console.log(this);
	this.autorun(()=>{
		this.subscribe('Categories');
		this.subscribe('Projects');
		this.subscribe('Images');
		this.subscribe('Covers');
		this.subscribe('Attachements');
		this.subscribe('Files');
	});
});


// helpers

// GLOBAL
Template.registerHelper('genUrlFromTitle', function(){
	let title = AutoForm.getFieldValue("title");
	if (title) {
		title = title.replace(/[\ .,;+=()*&<>%:']/g,'-');

		// console.log(title);
		return title.toLowerCase();
	}
});

Template.registerHelper('genUrlFromDate', function(){
	let date = AutoForm.getFieldValue("dateOfIssue");
	if (date) {
		date = moment(date).format('MMM-YYYY');
		// date = date.replace(/\ /g, '-');
		return date.toLowerCase();
	}
});



Template.portfolioDashboard.helpers({
	categories: ()=>{
		let categories = Categories.find();

		return categories;
	},
	currentCategoryEditor: (category)=>{
		let id = FlowRouter.getParam("category_id");
		if (id == category._id) {
			return true;
		} else {
			return false;
		}
	},
	projects: (category)=>{
		let projects;
		if (!category) {
			projects = Projects.find();
		} else {
			projects = Projects.find({primaryCategory:category._id});
			// console.log(projects.count() + ' projects within ' + category.title);
		}
		return projects;
	},
	currentProjectEditor: (project)=>{
		let id = FlowRouter.getParam("project_id");
		if (id == project._id) {
			return true;
		} else {
			return false;
		}
	},
	attachements: (category)=>{
		let attachements;
		if (!category) {
			attachements = Attachements.find();
		} else {
			attachements = Attachements.find({primaryCategory:category._id});
			// console.log(attachements.count() + ' attachements within ' + category.title);
		}
		return attachements;
	},
	currentAttachementEditor: (attachement)=>{
		let id = FlowRouter.getParam("attachement_id");
		if (id == attachement._id) {
			return true;
		} else {
			return false;
		}
	},
	covers: ()=>{
		let covers = Covers.find();

		return covers;
	},
	currentCoverEditor: (cover)=>{
		let id = FlowRouter.getParam("cover_id");
		if (id == cover._id) {
			return true;
		} else {
			return false;
		}
	},
});

Template.navPanelAdmin.helpers({
	isCurrentPage: function (page) {
		let path = FlowRouter.current().path;
		if (path.indexOf(page) >= 0 ) {
			return true;
		}
	}
});

Template.attachementEditor.helpers({
	types: function () {
		return [
          {label: "File", value: 'File'},
          {label: "Link", value: 'Link'}
        ];
	}
});

Template.preView.helpers({
	URL: function (page, type) {
		switch(type){
			case 'project':
				let catSlug = Categories.findOne({_id:page.primaryCategory}).slug;
				return '/portfolio/'+catSlug+'/'+page.slug;
			case 'category':
				return '/portfolio/'+page.slug;
			default:
				return '/cfs/files/images/'+ (typeof page.image == 'object' ? page.image[0].file : page.image);
		}
	}
});

// Events

Template.newObjectPanel.events({
	'click .js_add_category': (event, template) => {
		// console.log('attempting to create new category');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/portfolio/new-category');
	},
	'click .js_add_project': (event, template) => {
		// console.log('attempting to create new project');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/portfolio/new-project');
	},
	'click .js_add_cover': (event, template) => {
		// console.log('attempting to create new cover');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/portfolio/new-cover');
	},
	'click .js_add_attachement': (event, template) => {
		// console.log('attempting to create new attachement');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/portfolio/new-attachement');
	},
});

Template.preView.events({
	'click .js_edit_page': (event, template) =>{
		// console.log('attempting to edit object');
		// console.log(event);
		// console.log(template);
		let type = $(event.target).data('type');
		let id = $(event.target).data('id');
		FlowRouter.go('/admin/portfolio/edit-' + type + '/' + id);
	}
});

Template.categoryEditor.events({
	'click .js_cancel_add': (event, template) => {
		// console.log('cancell add or edit attemp');
		FlowRouter.go('/admin/portfolio');
	},
});


Template.projectEditor.inheritsEventsFrom("categoryEditor");
Template.attachementEditor.inheritsEventsFrom("categoryEditor");
Template.coverEditor.inheritsEventsFrom("categoryEditor");


AutoForm.hooks({
	projectForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'project', 'projectForm', this.docId);
		}
	},
	caetgoryForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'category', 'caetgoryForm', this.docId);
		}
	},
	coverForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'cover', 'coverForm', this.docId);
		}
	},
	attachementForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'attachement', 'attachementForm', this.docId);
		}
	},
})