// manage CRUD redirects
function crudRedirect (intent, type, formId, id){
	switch (intent){
		case 'save':
			FlowRouter.go('/admin');
			break
		case 'save_add':
			FlowRouter.go('/admin/new-'+type);
			AutoForm._forceResetFormValues(formId);
			break
		case 'save_edit':
			FlowRouter.go('/admin/edit-' + type + '/' + id);
			break
		default:
			FlowRouter.go('/admin');
			break
	}
}


// prerequisits

Template.dashboard.onCreated(function(){
	Session.set('saveIntent');
	// console.log(this);
	this.autorun(()=>{
		this.subscribe('Categories', /* [, arg1, arg2, ... ] [, callbacks] */);
		this.subscribe('Projects', /* [, arg1, arg2, ... ] [, callbacks] */);
		this.subscribe('Images', /* [, arg1, arg2, ... ] [, callbacks] */);
		this.subscribe('Covers', /* [, arg1, arg2, ... ] [, callbacks] */);
	})
});


// helpers

// GLOBAL
Template.registerHelper('genUrlFromTitle', function(){
	let title = AutoForm.getFieldValue("title");
	if (title) {
		title = title.replace(/\ /g, '-');
		return title.toLowerCase()
	}
})

Template.registerHelper('genUrlFromDate', function(){
	let date = AutoForm.getFieldValue("dateOfIssue");
	if (date) {
		date = moment(date).format('MMM-YYYY');
		// date = date.replace(/\ /g, '-');
		return date.toLowerCase()
	}
})



Template.dashboard.helpers({
	categories: ()=>{
		let categories = Categories.find();

		return categories
	},
	currentCategoryEditor: (category)=>{
		let id = FlowRouter.getParam("category_id")
		if (id == category._id) {
			return true
		} else {
			return false
		}
	},
	projects: (category)=>{
		let projects;
		if (!category) {
			projects = Projects.find();
		} else {
			projects = Projects.find({primaryCategory:category._id});
			console.log(projects.count() + ' projects within ' + category.title);
		}
		return projects
	},
	currentProjectEditor: (project)=>{
		let id = FlowRouter.getParam("project_id")
		if (id == project._id) {
			return true
		} else {
			return false
		}
	},
	covers: ()=>{
		let covers = Covers.find();

		return covers
	},
	currentCoverEditor: (cover)=>{
		let id = FlowRouter.getParam("cover_id")
		if (id == cover._id) {
			return true
		} else {
			return false
		}
	},
});



// Events

Template.newObjectPanel.events({
	'click .js_add_category': (event, template) => {
		console.log('attempting to create new category');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/new-category');
	},
	'click .js_add_project': (event, template) => {
		console.log('attempting to create new project');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/new-project');
	},
	'click .js_add_cover': (event, template) => {
		console.log('attempting to create new cover');
		// console.log(event);
		// console.log(template);
		FlowRouter.go('/admin/new-cover');
	},
});

Template.preView.events({
	'click .js_edit_page': (event, template) =>{
		console.log('attempting to edit object');
		console.log(event);
		console.log(template);
		let type = $(event.target).data('type');
		let id = $(event.target).data('id');
		FlowRouter.go('/admin/edit-' + type + '/' + id);
	}
});

Template.categoryEditor.events({
	'click .js_cancel_add': (event, template) => {
		console.log('cancell add or edit attemp');
		FlowRouter.go('/admin');
	},
});


Template.projectEditor.events({
	'click .js_cancel_add': (event, template) => {
		console.log('cancell add or edit attemp');
		FlowRouter.go('/admin');
	},
});

Template.coverEditor.events({
	'click .js_cancel_add': (event, template) => {
		console.log('cancell add or edit attemp');
		FlowRouter.go('/admin');
	},
});


AutoForm.hooks({
	projectForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'project', 'projectForm', this.docId)
		}
	},
	caetgoryForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'category', 'caetgoryForm', this.docId)
		}
	},
	coverForm: {
		onSuccess: function (formType, result) {
			// console.log(formType);
			// console.log(result);
			// console.log(this.docId);
			// console.log(Session.get('saveIntent'));
			crudRedirect (Session.get('saveIntent'), 'cover', 'coverForm', this.docId)
		}
	}
})