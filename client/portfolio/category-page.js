Template.categoryPage.helpers({
	category: function(){
		// console.log('category helper called');
	    // category in portfolio
	    if (FlowRouter.getParam("category")) {
		    let req = FlowRouter.current().params;
	    	
	    	let category = Categories.findOne({slug:req.category});
	    	
	    	if (category) {
		    	Session.set('current-category', category._id);

		    	// reset 'current-project'
		    	if (Session.get('current-project') && !req.project) {
		    		Session.set('current-project', undefined);
		    		Session.set('current-page', undefined);
		    	}

				return category
	    	}

	    } else {
	    	// reset session params

			return undefined
	    }
	},
	projects: function(){
		return Projects.find({$or:[{primaryCategory: Session.get('current-category')}, {secondaryCategory: Session.get('current-category')},]})
	}
});

Template.categoryCoverMenu.helpers({
	url: function (category){
		let params = {
			category: category.slug,
		}
		return FlowRouter.path('portfolio.category', params)
	},
	categories: function () {
		return Categories.find({},{sort:{order:1}});
	},
	isCurrentCategory: function(id){
		if (id==Session.get('current-category')) {
			return true
		}
	}
});

Template.galleryGrid.helpers({
	url: function (project) {
		let params = {
			category: Categories.findOne(project.primaryCategory).slug,
			project: project.slug
		}
		return FlowRouter.path('portfolio.project', params)
	}
});