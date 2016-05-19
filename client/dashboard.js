// Global functions
// // // // // // // // // // // // // // // // // // // // // // // // // //

// mannage redirects after form submission
function cat_redirect (e, t, id){
	// go to main admin UI
	// FlowRouter.go('/admin');
	var intent = t.saveIntent.get();
	console.log('rederecting to: ' + intent);
	// console.log(e);
	// console.log(t);
	// console.log(id);

	switch (intent) {
		case 'save':
			FlowRouter.go('/admin');
			break;
		case 'save_add':
			FlowRouter.go('/admin/new-category');
			t.find('form').reset();
			break;
		case 'save_edit':
			FlowRouter.go('/admin/edit-category/'+id);
			break;
		default:
			FlowRouter.go('/');
	}
}

function prj_redirect (e, t, id){
	var intent = t.saveIntent.get();
	console.log('rederecting to: ' + intent);
	// console.log(e);
	// console.log(t);
	// console.log(id);

	switch (intent) {
		case 'save':
			FlowRouter.go('/admin');
			break;
		case 'save_add':
			FlowRouter.go('/admin/new-project');
			t.find('form').reset();
			break;
		case 'save_edit':
			FlowRouter.go('/admin/edit-project/'+id);
			break;
		default:
			FlowRouter.go('/');
	}
}

function generate_edit_url(type, id){
	switch (type){
		case 'category':
		return FlowRouter.path('/admin/edit-category/'+id);

		case 'project':
		return FlowRouter.path('/admin/edit-project/'+id);

		default:
		return null

	}
}



// Global helpers
// // // // // // // // // // // // // // // // // // // // // // // // // //
Template.registerHelper('edit_category_url', function (id){
	return generate_edit_url('category', id)
});

Template.registerHelper('edit_project_url', function (id){
	return generate_edit_url('project', id)
});



// Dashboard
// // // // // // // // // // // // // // // // // // // // // // // // // //

Template.dashboard.onCreated(function(){

});

Template.dashboard.helpers({
	// get all categories of projects
	categories: function(){
		var categories = Categories.find({});

		return categories
	},
	// get all projects
	projects: function(){
		var projects = Projects.find({});

		return projects
	},
	// get all covers
	covers: function(){
		var covers = Covers.find({});

		return covers
	},
	new_category_url: function(){
		return FlowRouter.path('/admin/new-category')
	},
	new_project_url: function(){
		return FlowRouter.path('/admin/new-project')
	},
});

Template.dashboard.events({
	'click .collapse_toggle': function (e) {
		// ...
		$(e.target).siblings('.collapse').toggleClass('in');
		return false
	}
});



// Project editor
// // // // // // // // // // // // // // // // // // // // // // // // // // 
Template.projectEditor.onCreated(function(){
  var self = this;
  self.autorun(function(){
  	var prjId = FlowRouter.getParam('project_id');
  	if (prjId) {
  		self.subscribe('singleProject', prjId)
  	}
  });


  // Here, this equals the current template instance. We can assign
  // our ReactiveVar to it, making it accessible throughout the
  // current template instance.
  this.projectPages = new ReactiveVar();
  this.saveIntent = new ReactiveVar('save');
  this.editingProject = new ReactiveVar();
});


Template.projectEditor.helpers({
	// get or create project
	project: function(){
		var prjId = FlowRouter.getParam('project_id');
		var project = {};
		if (prjId){
			project = Projects.findOne({_id:prjId});
			Template.instance().editingProject.set(prjId);
		} else {
			Template.instance().editingProject.set();
		}
		return project
	},
	// get all categories of projects
	categories: function(){
		var categories = Categories.find({});

		return categories
	},
	pages: function () {
		// Template.instance().projectPages.set([{number:1, id:'page1'},{number:2, id:'page2'}]);
		// console.log(Template.instance().projectPages.get());
		return Template.instance().projectPages.get()
	}
});

Template.projectEditor.events({
	// modify event depending on which actor submited the form
	'click button[type=submit]': function (e, t){
		console.log(e);
		var button = $(e.target);
		// modify reactive var value
		if (button.hasClass('save_add')) {
			t.saveIntent.set('save_add');
		} else if (button.hasClass('save_edit')) {
			t.saveIntent.set('save_edit');
		} else {
			t.saveIntent.set('save');
		}
		// proceed form submission
		return e
	},
	'submit form': function(e, t){
		// prevent page reloads
		e.preventDefault();
		e.stopPropagation();
		// compose object
		var project = {};
		var form = $(e.target);
		project.name = form.find('#project_name').val();
		project.description = form.find('#project_description').val();
		project.category = form.find('#project_category').val();
		project.secondaryCategory = form.find('#project_secondary_category').val();
		project.dates=
		{
			start: form.find('#project_start_date').val(),
			end: form.find('#project_end_date').val(),
		};
		var img = form.find('#project_image')[0].files[0];
		// console.log(img);
		if (img) {
			project.img = Images.insert(img, function (err, fileObj) {
				// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				if (err) {
					return
				} else {
					console.log('inserted image: ' + fileObj._id);
					// generate image url
					return "/cfs/files/images/" + fileObj._id;
				}
			})._id;
		}

		// console.log(project.img);

		if (t.editingProject.get()) {
			var prjId = t.editingProject.get()
			console.log('attemting to update project: '+prjId);
			Meteor.call('updateProject', project, prjId, function (error, result) {
				if (error){
					console.log(error)
					return
				} else {
					console.log('updated project: ' + prjId)
					prj_redirect (e, t, prjId);
				}
			});
		} else {
			Meteor.call('addProject', project, function (error, result) {
				if (error){
					console.log(error)
					return
				} else {
					console.log('inserted project: ' + result)
					prj_redirect (e, t, result)
				}
			});
		}

		return false
	},
	'click button[type=delete]': function (e, t){
		t.saveIntent.set('save');
		if (t.editingProject.get) {
			var project = Projects.findOne({_id:t.editingProject.get()});
			console.log('attemting to delete: ' + project._id)
			bootbox.confirm('You are about to delete "' + project.name + '" project. Are you sure to proceed?', function(){
				Meteor.call('removeProject', project._id, function (error, result) {
					if (error){
						console.log(error);
						return
					} else {
						console.log('deleted project: ' + result);
						prj_redirect (e, t)
					}
				});
			})
		}
		return false
	},
	// tab controls
	'click .add_tab': function (e, t) {
		var pages = Template.instance().projectPages.get();
		pages.push({
			number: pages.length + 1,
			id: 'page'+ pages.length + 1,
		});
		Template.instance().projectPages.set(pages);
		// console.log(t);
	},
	'click .delete_tab': function (e,t){
		// e.preventDefault();
		// e.stopPropagation();
		var pages = Template.instance().projectPages.get();
		var id = $(e.target).data('id');
		pages.splice(pages.indexOf(pages.find(function(page){return page.id === id})), 1);
		Template.instance().projectPages.set(pages);
		return false
	},
	
});


// Category editor
// // // // // // // // // // // // // // // // // // // // // // // // // // 
Template.categoryEditor.onCreated(function(){
	var self = this;
	self.autorun(function(){
		var catId = FlowRouter.getParam('category_id');
		if (catId) {
			self.subscribe('singleCategory', catId)
		}
	});
	// store value to define action which will be performed after form submission
	this.saveIntent = new ReactiveVar('save');
	this.editingCategory = new ReactiveVar();
});

Template.categoryEditor.helpers({
	category: function () {
		var catId = FlowRouter.getParam('category_id');
		var category = {};
		if (catId){
			category = Categories.findOne({_id:catId});
			Template.instance().editingCategory.set(catId);
			// console.log(Template.instance().editingCategory.get(catId));
		} else {
			Template.instance().editingCategory.set();
		}
		return category
	},
});

Template.categoryEditor.events({
	// modify event depending on which actor submited the form
	'click button[type=submit]': function (e, t){
		console.log(e);
		var button = $(e.target);
		// modify reactive var value
		if (button.hasClass('save_add')) {
			t.saveIntent.set('save_add');
		} else if (button.hasClass('save_edit')) {
			t.saveIntent.set('save_edit');
		} else {
			t.saveIntent.set('save');
		}
		// proceed form submission
		return e
	},
	// collecting form data in object and calling server for saving or updating it.
	'submit form': function (e, t) {
		// prevent page reloads
		e.preventDefault();
		e.stopPropagation();
		// compose object
		var category = {};
		var form = $(e.target);
		category.name = form.find('#category_name').val();
		category.description = form.find('#category_description').val();
		category.summary = form.find('#category_summary').val();
		category.color = form.find('#category_color').val();
		var img = form.find('#category_image')[0].files[0];

		if (img) {
			category.img = Images.insert(img, function (err, fileObj) {
				// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				if (err) {
					return
				} else {
					console.log('inserted image: ' + fileObj._id);
					// generate image url
					return "/cfs/files/images/" + fileObj._id;
				}
			})._id;
		}

		console.log(category.img);

		if (t.editingCategory.get()) {
			var catId = t.editingCategory.get();
			console.log(t.editingCategory.get());
			Meteor.call('updateCategory', category, catId, function (error, result) {
				if (error){
					console.log(error)
					return
				} else {
					console.log('updated category: ' + catId)
					cat_redirect (e, t, catId)
				}
			});
		} else {
			Meteor.call('addCategory', category, function (error, result) {
				if (error){
					console.log(error)
					return
				} else {
					console.log('inserted category: ' + result)
					cat_redirect (e, t, result)
				}
			});
		}

		return false
	},
	'click button[type=delete]': function (e, t){
		t.saveIntent.set('save');
		if (t.editingCategory.get) {
			var category = Categories.findOne({_id:t.editingCategory.get()});
			console.log('attemting to delete: ' + category._id)
			bootbox.confirm('You are about to delete "' + category.name + '" project category. Are you sure to proceed?', function(){
				Meteor.call('removeCategory', category._id, function (error, result) {
					if (error){
						console.log(error);
						return
					} else {
						console.log('deleted category: ' + result);
						cat_redirect (e, t, result)
					}
				});
			})
		}
		return false
	}
});



// Pages preview
// // // // // // // // // // // // // // // // // // // // // // // // // // 

Template.dashboardPannel.helpers({
	// get all categories of projects
	categories: function(){
		var categories = {};
		categories.pages = Categories.find({});
		categories.name = 'Categories';
		categories.type = 'category'
		return categories
	},
	// get all projects
	projects: function(){
		var projects = {};
		projects.pages = Projects.find({});
		projects.name = 'Projects';
		projects.type = 'project'
		return projects
	},
});

Template.pageThumbnail.helpers({
	edit_url: function (context, id) {
		// console.log(context);
		// console.log(id);
		return generate_edit_url(context.type, id);
	}
});




















