dynamicColor=(self)=>{
	self.$('.dynamic_color').each(function(index, el) {
		if ($(el).data('color')) {
			$(el).css('background-color', $(el).data('color'));
		} else if(Session.get('current-category')) {
			let category = Categories.findOne(Session.get('current-category'));

			if (category) {
				$(el).css('background-color', category.color);
			}
		}
	});
}

function slugify (object){
	if (object) {
		return object.slug
	} else {
		return undefined
	}
}

function navigationURL (axis, direction){
	console.log(direction + ' in ' + axis);
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
					break
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
					break
			}
			break
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
					break
				case 'prev':
					if (current_project) {
						params.project = Projects.findOne({order: {$lt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
						params.project = slugify(params.project);
						params.category = current_category.slug;
					} else if (current_category){
						let prev_category_by_order = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:1}});
						if (prev_category_by_order) {
							params.project = Projects.findOne({primaryCategory: prev_category_by_order._id},{sort:{order:-1}});
							params.project = slugify(params.project);
							params.category = prev_category_by_order.slug;
						}
					}
					// navigate to prev category
					if (!params.project && !params.category) {
						if (current_category) {
							params.category = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:1}});
						} else {
							params.category = Categories.findOne({},{sort:{order:-1}});
						}
						params.category = slugify(params.category);
						
					}
					break
			}
			break
	}

	console.log(params);
	if (params.project && params.category) {
		return FlowRouter.path('portfolio.project', params)
	} else if (params.category){
		return FlowRouter.path('portfolio.category', params)
	} else {
		return FlowRouter.path('portfolio')
	}

}

Template.onRendered(function(){
	var self=this;

	self.autorun(function(){
		if(! self.subscriptionsReady())
			return;
		dynamicColor(self);
	})
});


Template.registerHelper('dateMY', function(date){
	return moment(date).format('MMM YYYY')
});


Template.registerHelper('nextPortfolioPageURL', function(){
	return navigationURL('order', 'next');
});


Template.registerHelper('prevPortfolioPageURL', function(){
	return navigationURL('order', 'prev');
});

Template.registerHelper('portfolioTimeline',function(){

});

Template.registerHelper('coverPageButtonUrl', function(){
	let current_category = Categories.findOne({},{sort:{order:1}});
	if (current_category) {
		let params = {
			category: current_category.slug
		}
		return FlowRouter.path('portfolio.category', params)
	}

});

portfolioHotKeys = new Hotkeys({
	autoLoad:false
});

portfolioHotKeys.add({
	combo:'right',
	callback : function(){
        FlowRouter.go(navigationURL('order','next'));
    }
});
portfolioHotKeys.add({
	combo:'left',
	callback : function(){
        FlowRouter.go(navigationURL('order','prev'));
    }
});
portfolioHotKeys.add({
	combo:'down',
	callback : function(){
        FlowRouter.go(navigationURL('time','next'));
    }
});
portfolioHotKeys.add({
	combo:'up',
	callback : function(){
        FlowRouter.go(navigationURL('time','prev'));
    }
});

Template.portfolio.onCreated(function(){
	// this.getCurrentCategory = ()=> FlowRouter.current().params.category;
	// this.getCurrentProject = ()=> FlowRouter.current().params.preoject;

	var self = this;

	 // Subscribe
	self.subscribe("Categories");
	self.subscribe("Projects");
	self.subscribe("Covers");


	// Do reactive stuff when subscribe is ready
	self.autorun(function() {
	//    	if(! self.subscriptionsReady())
	//     	return;
		portfolioHotKeys.load();
	    
	});
});

Template.portfolio.onDestroyed(function(){
	// var self = this;

	// self.autorun(func)
	portfolioHotKeys.unload();
});






// Template.background.onRendered(function(){
// 	this.autorun(function(){
// 		// set images
// 		Template.instance().$('.background').css('background-image', Template.currentData().image.data);
// 		// set class
// 		Template.instance().$('.background').addClass(Template.currentData().image.navState);
// 		// handle mousemove with parallax
// 		Template.instance().$('.background').mousemove(function(event) {
// 			let position = Math.round10(event.pageX/$(window).width()*-10, -1) + 'vw ' + Math.round10(event.pageY/$(window).height()*-10, -1) + 'vh';
// 			$(this).css('background-position', position);
// 		});
// 	})
// });


// Template.projectView.helpers({
// 	category: function() {
// 		const catSlug = FlowRouter.getParam("category");
// 		const category = Categories.findOne({slug:catSlug});
// 		if (category) {
// 			Session.set('current-category', category._id);


// 			let category_by_order = {
// 				next: Categories.findOne({order:category.order + 1}),
// 				prev: Categories.findOne({order:category.order - 1}),
// 			};

// 			if (category_by_order.next) {
// 				Session.set('next-category', category_by_order.next._id);
// 			} else {
// 				Session.set('next-category', null);
// 			}

// 			if (category_by_order.prev) {
// 				Session.set('prev-category', category_by_order.prev._id);
// 			} else {
// 				Session.set('prev-category', null);
// 			}

// 			// console.log();
// 			return category
// 		}
// 	},
// 	project: function (category) {
// 		const prjSlug = FlowRouter.getParam("project");
// 		const project = Projects.findOne({
// 			slug: prjSlug,
// 			primaryCategory: Session.get('current-category')
// 		});
// 		if (project) {


// 			Session.set('current-project', project._id);
			
// 			if (project.pages) {
// 				console.log(project.pages);
// 				Session.set('next-page', project.pages[0].slug);
// 			}else{
// 				Session.set('next-page', undefined);
// 			}

// 			// configure relative navigation
// 			let project_by_order = {
// 				next: Projects.findOne({order:project.order + 1, primaryCategory: Session.get('current-category')}),
// 				prev: Projects.findOne({order:project.order - 1, primaryCategory: Session.get('current-category')}),
// 			};
// 			// by order
// 			// next
// 			if (project_by_order.next) {
// 				// console.log('next-by-order in same category');
// 				Session.set('next-project-by-order', project_by_order.next._id);
// 			} else if (Session.get('next-category')) { // try in following category

// 				project_by_order.next = Projects.findOne({order: {$lte:1}, primaryCategory: Session.get('next-category')});

// 				if (project_by_order.next) {
// 					// console.log('next project in next category');
// 					Session.set('next-project-by-order', project_by_order.next._id);
// 				} else { //no next project
// 					Session.set('next-project-by-order', null);
// 				}

// 			} else { //no next project
// 				Session.set('next-project-by-order', null);
// 			}

// 			// prev 
// 			if (project_by_order.prev) {
// 				// console.log('prev-by-order in same category');
// 				Session.set('prev-project-by-order', project_by_order.prev._id);
// 			} else if (Session.get('prev-category')) { // try in following category

// 				project_by_order.prev = Projects.findOne({primaryCategory: Session.get('prev-category')},{sort:{order:-1}});

// 				if (project_by_order.prev) {
// 					// console.log('prev project in prev category');
// 					Session.set('prev-project-by-order', project_by_order.prev._id);
// 				} else { //no prev project
// 					Session.set('prev-project-by-order', null);
// 				}

// 			} else { //no prev project
// 				Session.set('prev-project-by-order', null);
// 			}

// 			// by time
// 			let project_by_time = {
// 				next: Projects.findOne({startDate:{$gt:project.startDate}},{sort:{startDate:1}}),
// 				prev: Projects.findOne({startDate:{$lt:project.startDate}},{sort:{startDate:-1}}),
// 			}
// 			// next
// 			if (project_by_time.next) {
// 				Session.set('next-project-in-time', project_by_time.next._id);
// 			} else {
// 				Session.set('next-project-in-time', null);
// 			}
// 			// prev
// 			if (project_by_time.prev) {
// 				Session.set('prev-project-in-time', project_by_time.prev._id);
// 			} else {
// 				Session.set('prev-project-in-time', null);
// 			}


// 			return project
// 		}
// 	},
// 	images: function () {
// 		let images = [];
// 		let navStates = ['prev-project-in-time', 'next-project-in-time', 'prev-project-by-order', 'next-project-by-order', 'current-project'];

// 		for (var i = 0; i < navStates.length; i++) {
// 			let image = {navState: navStates[i]};
// 			if (Session.get(navStates[i])){
// 				let url = 'url(/cfs/files/images/'+ Projects.findOne(Session.get(navStates[i])).image +')';
// 				// images = images + url;
// 				image.data = url;
// 			} else {
// 				let gradient = 'linear-gradient(to right, transparent 0%,' + Categories.findOne(Session.get('current-category')).color + ' 100%, transparent 100%)';
// 				// images = images + gradient;
// 				image.data = gradient;
// 			}
// 			images.push(image);
// 		}
		

// 		// console.log(images);
// 		// const style = 'background-image: '+images;
// 		return images
// 	},
// 	letters: function(){
// 		const catId = Session.get('current-category');
// 		if (catId) {
// 			return Categories.findOne(catId).shortCut
// 		} else {
// 			return 'Menu'
// 		}
// 	},
// 	color:  function(){
// 		const catId = Session.get('current-category');
// 		if (catId) {
// 			const style = 'background-color:'+Categories.findOne(catId).color+';';
// 			return style
// 		}
// 	},
// 	nextProjectUrl: function() {
// 		if (Session.get('next-page')) {
// 			// FlowRouter.setParams({page:''})
// 			let params = FlowRouter.current().params;
// 			params.page = Session.get('next-page');

// 			return FlowRouter.path('portfolio.project.page', params)
// 		} else if (Session.get('next-project-by-order')) {
// 			const project = Projects.findOne(Session.get('next-project-by-order'));
// 			const category = Categories.findOne(project.primaryCategory);
// 			return FlowRouter.path('portfolio.project', {category: category.slug, project: project.slug})
// 		} else {
// 			return FlowRouter.path('portfolio.back-cover');
// 		}
// 	},
// 	prevProjectUrl: function() {
// 		if (Session.get('prev-project-by-order')) {
// 			const project = Projects.findOne(Session.get('prev-project-by-order'));
// 			const category = Categories.findOne(project.primaryCategory);
// 			return FlowRouter.path('portfolio.project', {category: category.slug, project: project.slug})
// 		} else {
// 			return FlowRouter.path('portfolio')
// 		}
// 	},
// });

// // Template.projectPageView.helpers({
// // 	project: function (){

// // 	},
// // 	page: function (project) {
// // 		const project = Projects.findOne(project);
// // 	}
// // });



// Template.portfolio.events({

// });


