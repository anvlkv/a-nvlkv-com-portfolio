function slugify (object){
	if (object) {
		return object.slug;
	} else {
		return undefined;
	}
}

function navigationOBJ (axis, direction){
	let current_project = Projects.findOne(Session.get('current-project')),
	current_category = Categories.findOne(Session.get('current-category')),
	params={};
	switch (axis){
		case 'time':
			switch (direction){
				case 'next':
					if (current_project) {
						params.project = Projects.findOne({endDate : {$lt : current_project.endDate}},{sort:{endDate:-1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
								if (params.project) {
									params.project = params.project._id;
								}
								if (params.category) {
									params.category = params.category._id;
								}
						}
					} else if (current_category){
						params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{endDate:-1}});
							if (params.project) {
								params.project = params.project._id;
							}
							if (current_category) {
								params.category = current_category._id;
							}
					} else {
						params.project = Projects.findOne({},{sort:{endDate:-1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
								if (params.project) {
									params.project = params.project._id;
								}
								if (params.category) {
									params.category = params.category._id;
								}
						}
					}
					break;
				case 'prev':
					if (current_project) {
						params.project = Projects.findOne({endDate : {$gt : current_project.endDate}},{sort:{endDate:1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
								if (params.project) {
									params.project = params.project._id;
								}
								if (params.category) {
									params.category = params.category._id;
								}
						}
					} else if (current_category){
						params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{endDate:1}});
							if (params.project) {
								params.project = params.project._id;
							}
							if (current_category) {
								params.category = current_category._id;
							}
					} else {
						params.project = Projects.findOne({},{sort:{endDate:1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
								if (params.project) {
									params.project = params.project._id;
								}
								if (params.category) {
									params.category = params.category._id;
								}
						}
					}
					break;
			}
			break;
		case 'order':
			switch (direction){
				case 'next':
					if (current_project) {
						params.project = Projects.findOne({order: {$gt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
							if (params.project) {
								params.project = params.project._id;
							}
						if (params.project) {
							params.category = current_category._id;
						}
					} else if (current_category){
						params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{order:1}});
							if (params.project) {
								params.project = params.project._id;
							}
						params.category = current_category._id;
					}
					// navigate to next category
					if (!params.project && !params.category) {
						if (current_category) {
							params.category = Categories.findOne({order: {$gt: current_category.order}},{sort:{order:1}});
						} else {
							params.category = Categories.findOne({},{sort:{order:1}});
						}
							if (params.category) {
								params.category = params.category._id;
							}
						
					}
					break;
				case 'prev':
					if (current_project) {
						params.project = Projects.findOne({order: {$lt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
							if (params.project) {
								params.project = params.project._id;
							}
						params.category = current_category._id;
					} else if (current_category){
						let prev_category_by_order = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:-1}});
						if (prev_category_by_order) {
							params.project = Projects.findOne({primaryCategory: prev_category_by_order._id},{sort:{order:-1}});
								if (params.project) {
									params.project = params.project._id;
								}
							params.category = prev_category_by_order._id;
						}
					}
					// navigate to prev category
					if (!params.project && !params.category) {
						if (current_category) {
							params.category = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:-1}});
						} else {
							params.category = Categories.findOne({},{sort:{order:-1}});
						}
							if (params.category) {
								params.category = params.category._id;
							}
						
					}
					break;
			}
			break;
	}

	return params;
}

function navigationURL (axis, direction){
	// console.log(direction + ' in ' + axis);
	let current_project = Projects.findOne(Session.get('current-project')),
	current_category = Categories.findOne(Session.get('current-category')),
	params={};
	switch (axis){
		case 'time':
			switch (direction){
				case 'next':
					if (current_project) {
						params.project = Projects.findOne({endDate : {$lt : current_project.endDate}},{sort:{endDate:-1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
							params.project = slugify(params.project);
							params.category = slugify(params.category);
						}
					} else if (current_category){
						params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{endDate:-1}});
						params.project = slugify(params.project);
						params.category = slugify(current_category);
					} else {
						params.project = Projects.findOne({},{sort:{endDate:-1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
							params.project = slugify(params.project);
							params.category = slugify(params.category);
						}
					}
					break;
				case 'prev':
					if (current_project) {
						params.project = Projects.findOne({endDate : {$gt : current_project.endDate}},{sort:{endDate:1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
							params.project = slugify(params.project);
							params.category = slugify(params.category);
						}
					} else if (current_category){
						params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{endDate:1}});
						params.project = slugify(params.project);
						params.category = slugify(current_category);
					} else {
						params.project = Projects.findOne({},{sort:{endDate:1}});
						if (params.project) {
							params.category = Categories.findOne(params.project.primaryCategory);
							params.project = slugify(params.project);
							params.category = slugify(params.category);
						}
					}
					break;
			}
			break;
		case 'order':
			switch (direction){
				case 'next':
					if (current_project) {
						params.project = Projects.findOne({order: {$gt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
						params.project = slugify(params.project);
						if (params.project) {
							params.category = current_category.slug;
						}
					} else if (current_category){
						params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{order:1}});
						params.project = slugify(params.project);
						params.category = current_category.slug;
					}
					// navigate to next category
					if (!params.project && !params.category) {
						if (current_category) {
							params.category = Categories.findOne({order: {$gt: current_category.order}},{sort:{order:1}});
						} else {
							params.category = Categories.findOne({},{sort:{order:1}});
						}
						params.category = slugify(params.category);
						
					}
					break;
				case 'prev':
					if (current_project) {
						params.project = Projects.findOne({order: {$lt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
						params.project = slugify(params.project);
						params.category = current_category.slug;
					} else if (current_category){
						let prev_category_by_order = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:-1}});
						if (prev_category_by_order) {
							params.project = Projects.findOne({primaryCategory: prev_category_by_order._id},{sort:{order:-1}});
							params.project = slugify(params.project);
							params.category = prev_category_by_order.slug;
						}
					}
					// navigate to prev category
					if (!params.project && !params.category) {
						if (current_category) {
							params.category = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:-1}});
						} else {
							params.category = Categories.findOne({},{sort:{order:-1}});
						}
						params.category = slugify(params.category);
						
					}
					break;
				case 'current':
					if (current_project) {
						if (current_project.pages && Session.get('current-page')) {
							for (var i = 0; i < current_project.pages.length; i++) {
								if (current_project.pages[i].slug == Session.get('current-page') && current_project.pages.length - 1 > i){
									params.page = current_project.pages[i+1].slug;
									params.project = current_project.slug;
									params.category = current_category.slug;
								} else if (current_project.pages.length - 1 == i && !params.page) {
									// add contact form here
									return navigationURL('order', 'next');
								}
							}
						} else if (current_project.pages) {
							params.page = current_project.pages[0].slug;
							params.project = current_project.slug;
							params.category = current_category.slug;
						} else {
							// add contact form here
							return navigationURL('order', 'next');
						}
					} else {
						return navigationURL('order', 'next');
					}
					break;
			}
			break;
	}

	// console.log(params);
	if (params.project && params.category && params.page) {
		return FlowRouter.path('portfolio.project.page', params);
	} else if (params.project && params.category) {
		return FlowRouter.path('portfolio.project', params);
	} else if (params.category){
		return FlowRouter.path('portfolio.category', params);
	} else {
		return FlowRouter.path('portfolio');
	}

}




Template.registerHelper('dateMY', function(date){
	return moment(date).format('MMM YYYY');
});


Template.registerHelper('nextPortfolioPageURL', function(){
	return navigationURL('order', 'next');
});


Template.registerHelper('prevPortfolioPageURL', function(){
	return navigationURL('order', 'prev');
});

Template.registerHelper('detailsURL',function(){
	return navigationURL('order', 'current');
});

portfolioHotKeys = new Hotkeys({
	autoLoad:false
});

portfolioHotKeys.add({
	combo:'right',
	callback : function(){
		if (!Session.get('menu-open') && !Session.get('email-dialog-open')){
	        FlowRouter.go(navigationURL('order','next'));
	    } 
    }
});
portfolioHotKeys.add({
	combo:'left',
	callback : function(){
		if (!Session.get('menu-open') && !Session.get('email-dialog-open')){
	        FlowRouter.go(navigationURL('order','prev'));
	    } 
    }
});
portfolioHotKeys.add({
	combo:'down',
	callback : function(){
		if (!Session.get('menu-open') && !Session.get('email-dialog-open')){
	        FlowRouter.go(navigationURL('time','next'));
	    } 
    }
});
portfolioHotKeys.add({
	combo:'up',
	callback : function(){
		if (!Session.get('menu-open') && !Session.get('email-dialog-open')){
	        FlowRouter.go(navigationURL('time','prev'));
	    } 
    }
});
portfolioHotKeys.add({
	combo:'enter',
	callback : function(){
		if (!Session.get('menu-open') && !Session.get('email-dialog-open')){
	        FlowRouter.go(navigationURL('order','current'));
	    } 
    }
});

Template.portfolio.onCreated(function(){

	this.autorun(()=>{
		
		let cat = CategorySubs.subscribe('CategoriesList'),
			prj = ProjectSubs.subscribe('ProjectsFeed'),
			cvr = CoverSubs.subscribe('ActiveCovers');

		

		this.ready.set(cat.ready() && prj.ready() && cvr.ready());

		if (this.ready.get()) {
			let navs = [navigationOBJ('order','next'), navigationOBJ('order','prev'), navigationOBJ('time','next'), navigationOBJ('time','prev')];
			for (var i = 0; i < navs.length; i++) {
				if (navs[i].project) {
					AdjacentSubs.subscribe('Project', navs[i].project);
				}
				if (navs[i].category) {
					AdjacentSubs.subscribe('Category', navs[i].category);
				}
			}
		}
		// console.log(AdjacentSubs);

		// this.ready.set(Subs.ready());
		
		// this.ready(function(){
		// 	// find and subscribe for ajdacent categories and projects
		// 	// 
		// 	// find currect position
		// 	let current_category, current_project, adj_categories, adj_projects;
		// 	if (Session.get('current-category')) {
		// 		current_category = Categories.findOne(Session.get('current-category'));
		// 	}else{
		// 		current_category = Categories.findOne({},{sort:{order:1}});
		// 	}
		// 	if (Session.get('current-project')) {
		// 		current_project = Projects.findOne(Session.get('current-project'));
		// 	} else {
		// 		current_project = Projects.findOne({primaryCategory:current_category._id},{sort:{order:1}});
		// 	}
		// 	// find adjacent items
		// 	// 
		// 	// by order and end date
		// 	adj_categories = Categories.find({$or: [ { oder: current_category.order - 1 }, { oder: current_category.order + 1 } ]});
		// 	adj_projects = Projects.find(
		// 		{
		// 			$or: [ { 
		// 					oder: current_project.order - 1,
		// 					primaryCategory: current_category._id,
		// 				}, {
		// 					oder: current_project.order + 1,
		// 					primaryCategory: current_category._id,
		// 				}, {
		// 					endDate:{$gt:current_project.endDate},
		// 				},{
		// 					endDate:{$lt:current_project.endDate},
		// 					}
		// 				}
		// 			]
		// 		}

			// );
		// });

		Session.set('menu-open', false);
		Session.set('email-dialog-open', false);
		portfolioHotKeys.load();
	    
	});
});



Template.portfolio.onRendered(function(){
	if (Modernizr.touchevents) {
		this.$('.page').swipe({
			swipe: function(event, direction, distance, duration, fingerCount, fingerData){
				if (!Session.get('menu-open') && !Session.get('email-dialog-open')) {
					switch (direction){
						case 'left':
							FlowRouter.go(navigationURL('order','next'));
							break;
						case 'right':
							FlowRouter.go(navigationURL('order','prev'));
							break;
						case 'up':
							FlowRouter.go(navigationURL('time','next'));
							break;
						case 'down':
							FlowRouter.go(navigationURL('time','prev'));
							break;
					}
				}
			}
		});
	}
	if(this.ready.get())
		dynamicColor(this);
});

Template.portfolio.onDestroyed(function(){
	portfolioHotKeys.unload();
});


Template.portfolio.helpers({
	overlay: function () {
		const route = FlowRouter.current();
		if (route.queryParams.menu && route.queryParams.email) {
			FlowRouter.go(route.route.name, route.params);
		}
		if (route.queryParams.menu || Session.get('menu-open')) {
			if (!Session.get('menu-open')) {
				Session.set('menu-open', true);
			}
			if (!route.queryParams.menu) {
				FlowRouter.go(route.route.name, route.params, {menu:true});
			}	

			return 'menuOverlay';
		} else if (route.queryParams.email || Session.get('email-dialog-open')){
			if (!Session.get('email-dialog-open')) {
				Session.set('email-dialog-open', true);
			}
			if (!route.queryParams.menu) {
				FlowRouter.go(route.route.name, route.params, {email:true});
			}	

			return 'emailOverlay';
		}
	}
});