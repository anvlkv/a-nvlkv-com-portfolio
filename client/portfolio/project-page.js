Template.projectPage.onCreated(function(){
	this.getCurrent_Category = ()=>{
	    if (FlowRouter.getParam("category")) {
		    let req = FlowRouter.current().params;
	    	
	    	let category = Categories.findOne({slug:req.category});
	    	
	    	if (category) {
		    	Session.set('current-category', category._id);


				return category._id;
	    	}
	    }
	};
	this.getCurrent_Project = ()=>{
	    if (FlowRouter.getParam("project")) {
		    
		    const req = FlowRouter.current().params;


		    // if category is not set or is not the same as in url set category
	    	
		    let category = Categories.findOne({_id:this.getCurrent_Category()}),
	    		project = Projects.findOne({slug:req.project, primaryCategory: this.getCurrent_Category()});

	    	if (project) {
		    	Session.set('current-project', project._id);
		    	Session.set('current-page-title', category.title + '.' + project.title);

				// page in project
				if (req.page) {

					Session.set('current-page', req.page);	
				} else {
					Session.set('current-page', undefined);
				}

				return project._id;

	    	}
	    }
	};
	this.getCurrent_ProjectPage = ()=>{
		if (FlowRouter.getParam('page')) {
		    const req = FlowRouter.current().params;
		    let project = Projects.findOne(this.getCurrent_Project());
		    // console.log(project);
		    if (project.pages) {
		    	project.pages.forEach(function (page) {
		    		if (req.page == page.slug) {
		    			return page;
		    		}
		    	});
		    }
		}
	};

	this.autorun(()=>{
		let prj = ProjectSubs.subscribe('Project', this.getCurrent_Project()),
			cat = ProjectSubs.subscribe('Category', this.getCurrent_Category());

		this.ready.set(prj.ready() && cat.ready());


		// console.log(this.getCurrent_Project(), this.getCurrent_Category());

	});

	this.autorun(()=>{
		if (this.ready.get()===true) {
			if (this.getCurrent_ProjectPage()) {
				Session.set('current-page',this.getCurrent_ProjectPage().slug);
			}

			// console.log(Projects.find({_id:this.getCurrent_Project()}).fetch()[0].pages);
		}
	});
});


Template.projectPage.onDestroyed(function(){
	Session.set('current-page-title', null);
});


Template.projectPage.helpers({
	project: function(){
		let project = Projects.findOne(Session.get('current-project'));

		return project;
	},
	image: function(){
		let project = Projects.findOne(Session.get('current-project'));
		if (Session.get('current-page') && project.pages) {
			let current_image;
			project = CC_Projects_unpublishedFields.findOne(Session.get('current-project'));
			project.pages.forEach(function (page) {
				// console.log(page);
				if (Session.get('current-page') == page.slug) {
					current_image = page.image;
				}
			});
			return current_image;
		} else {
			return project.image;
		}
	},
	isProjectPageView: function(){
		if (Session.get('current-page')) {
			return true;
		}
	}
});

Template.projectPagination.helpers({
	isCurrentProjectPage: function (slug) {
		if (slug) {
			return Session.get('current-page')==slug;
		} else {
			return !Session.get('current-page');
		}
	},
	projectCoverUrl: function(){
		if (Session.get('current-page') && Session.get('current-project')) {
			params = {
				category: Categories.findOne(Session.get('current-category')).slug,
				project: Projects.findOne(Session.get('current-project')).slug,
			};
			return FlowRouter.path('portfolio.project', params);
		}
	},
	projectPageUrl: function(slug){
		if (Session.get('current-project') && Session.get('current-category')) {
			params = {
				category: Categories.findOne(Session.get('current-category')).slug,
				project: Projects.findOne(Session.get('current-project')).slug,
				page: slug
			};
			return FlowRouter.path('portfolio.project.page', params);
		}
	},
	buttonText: function(){
		if (this.pages){
			if (Session.get('current-page')) {
				return 'Next';
			} else {
				return 'Learn more';
			}
		} else {
			return false;
		}
	}
});

Template.projectText.helpers({
	description: function () {
		if (FlowRouter.getParam('page')) {
			// console.log(FlowRouter.getParam("page"));
			// Session.set('current-page', FlowRouter.getParam('page'));

			let project = CC_Projects_unpublishedFields.findOne(Session.get('current-project'));
			if (project && project.pages) {
				let description;
				project.pages.forEach(function (page) {
					// console.log(page);
					if (Session.get('current-page') == page.slug) {
						description = page.text;
					}
				});
				return description;
			}
			
		}
	},
	image: function(){

		// console.log(FlowRouter.getParam("page"));

		if (FlowRouter.getParam('page')) {
			
			// Session.set('current-page', FlowRouter.getParam('page'));

			let project = CC_Projects_unpublishedFields.findOne(Session.get('current-project'));
			// console.log(project);
			if (project && project.pages) {
				let image;
				project.pages.forEach(function (page) {
					// console.log(page);
					if (Session.get('current-page') == page.slug) {
						image = page.image;
					}
				});
				return image;
			}
			
		}
	},
});