Template.projectPage.helpers({
	project: function(){
		// console.log('project helper called');

	    // project in category
	    if (FlowRouter.getParam("project")) {
		    
		    const req = FlowRouter.current().params;


		    // if category is not set or is not the same as in url set category
	    	if (!(Session.get('current-category') && Categories.findOne(Session.get('current-category')).slug == req.category)) {
	    		Session.set('current-category', Categories.findOne({slug:req.category})._id);
	    	}

	    	let project = Projects.findOne({slug:req.project, primaryCategory: Session.get('current-category')})

	    	if (project) {
		    	Session.set('current-project', project._id);

				// page in project
				if (req.page) {

					Session.set('current-page', req.page);	
				} else {
					Session.set('current-page', undefined);
				}

				return project

	    	}
	    }

	},
	image: function(){
		if (Session.get('current-project')) {
			let project = Projects.findOne(Session.get('current-project'));
			if (Session.get('current-page')) {
				let current_image;
				project.pages.forEach(function (page) {
					// console.log(page);
					if (Session.get('current-page') == page.slug) {
						current_image = page.image
					}
				});
				return current_image
			} else {
				return project.image
			}
		}
	}
});

Template.projectPagination.helpers({
	isCurrentProjectPage: function (slug) {
		if (slug) {
			return Session.get('current-page')==slug
		} else {
			return !Session.get('current-page')
		}
	},
	projectCoverUrl: function(){
		if (Session.get('current-page') && Session.get('current-project')) {
			params = {
				category: Categories.findOne(Session.get('current-category')).slug,
				project: Projects.findOne(Session.get('current-project')).slug,
			}
			return FlowRouter.path('portfolio.project', params)
		}
	},
	projectPageUrl: function(slug){
		if (Session.get('current-project') && Session.get('current-category')) {
			params = {
				category: Categories.findOne(Session.get('current-category')).slug,
				project: Projects.findOne(Session.get('current-project')).slug,
				page: slug
			}
			return FlowRouter.path('portfolio.project.page', params)
		}
	}
});

Template.projectText.helpers({
	description: function () {
		if (FlowRouter.getParam('page')) {
			// console.log(FlowRouter.getParam("page"));
			Session.set('current-page', FlowRouter.getParam('page'));

			let project = Projects.findOne(Session.get('current-project'));
			let description;
			project.pages.forEach(function (page) {
				// console.log(page);
				if (Session.get('current-page') == page.slug) {
					description = page.text
				}
			});
			return description
		}
	}
});