navigationPath = new ReactiveDict();

let currentPath = new ReactiveDict();
let totalPath = new ReactiveDict();


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
									return navigationOBJ('order', 'next');
								}
							}
						} else if (current_project.pages) {
							params.page = current_project.pages[0].slug;
							params.project = current_project._id;
							params.category = current_category._id;
						} else {
							// add contact form here
							return navigationOBJ('order', 'next');
						}
					} else {
						return navigationOBJ('order', 'next');
					}
					break;
			}
			break;
	}

	return params;
}

function navigationURL (axis, direction){

	let params = navigationOBJ(axis, direction);

	params = {
		project: slugify(Projects.findOne({_id:params.project})),
		category: slugify(Categories.findOne({_id:params.category})),
		page: params.page
	};

	// console.log(arguments, params);
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

function navigateByTo (axis, direction){
	if (!navigationPath.get('direction') || !navigationPath.get('axis')) {
		navigationPath.set('direction', direction);
		navigationPath.set('axis', axis);
	} else {
		if (navigationPath.get('axis') === axis && navigationPath.get('direction') === direction) {
			navigationPath.set('continuous', true);
		}else{
			navigationPath.set('continuous', false);


			if (Session.get('consent') && Session.get('consent') != 'opt-out') {
				let interruption = '';
				if (navigationPath.get('axis') != axis) {
					interruption += navigationPath.get('axis') + '-' + axis + '|';
				}
				if (navigationPath.get('direction') != direction) {
					interruption += navigationPath.get('direction') + '-' + direction + '|';
				}
				GAnalytics.event(FlowRouter.current().path, 'path-interrupted', interruption);
			}
			

			navigationPath.set('direction', direction);
			navigationPath.set('axis', axis);
		}
	}

	FlowRouter.go(navigationURL(axis, direction));
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
		GAnalytics.event('portfolio','key-press', 'right');
		hideHint();
		if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint'){
	        navigateByTo('order','next');
	        addToExperiencePath('keysHorizontal');
	    }
    }
});
portfolioHotKeys.add({
	combo:'left',
	callback : function(){
		GAnalytics.event('portfolio','key-press', 'left');
		hideHint();
		if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint'){
	        navigateByTo('order','prev');
	        addToExperiencePath('keysHorizontal');
	    } 
    }
});
portfolioHotKeys.add({
	combo:'down',
	callback : function(){
		GAnalytics.event('portfolio','key-press', 'down');
		hideHint();
		if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint'){
	        navigateByTo('time','next');
	        addToExperiencePath('keysVertical');
	    } 
    }
});
portfolioHotKeys.add({
	combo:'up',
	callback : function(){
		GAnalytics.event('portfolio','key-press', 'up');
		hideHint();
		if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint'){
	        navigateByTo('time','prev');
	        addToExperiencePath('keysVertical');
	    } 
    }
});
portfolioHotKeys.add({
	combo:'enter',
	callback : function(){
		GAnalytics.event('portfolio','key-press', 'enter');
		hideHint();
		if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint'){
	        navigateByTo('order','current');
	        addToExperiencePath('keyEnter');
	    } 
    }
});

Template.portfolio.onCreated(function(){

	this.autorun(()=>{
		
		let cat = CategorySubs.subscribe('CategoriesList'),
			prj = ProjectSubs.subscribe('ProjectsFeed'),
			cvr = CoverSubs.subscribe('ActiveCovers');

		

		// console.log(cat.ready() && prj.ready() && cvr.ready());
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
			// init path
			Projects.find({}).forEach(function (project) {
				totalPath.set(project._id, true);
			});
			if (Session.get('consent') && Session.get('consent') != 'opt-out' && Cookie.get('a_nvlkv_path')) {
				let previous = Cookie.get('a_nvlkv_path').split('|');
				$.each(previous, function(index, val) {
					currentPath.set(val, true);
				});
			}
		}
	});
});



let interval;
let hintTimeout=[];

Template.portfolio.onRendered(function(){
	// keyboard
	portfolioHotKeys.load();
	// swiping
	if (Modernizr.touchevents) {
		let win = $(window),
			pgn = this.$('.page');

		pgn.swipe({
			swipeLeft: function(event, direction){
				GAnalytics.event('portfolio', 'swipe', direction);
				hideHint();
				if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint') {
					navigateByTo('order','next');
					addToExperiencePath('swipeHorizontal');
				}
			},
			swipeRight: function(event, direction){
				GAnalytics.event('portfolio', 'swipe', direction);
				hideHint();
				if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint') {
					navigateByTo('order','prev');
					addToExperiencePath('swipeHorizontal');
				}
			},
			doubleTap: function(event){
				GAnalytics.event('portfolio', 'doubleTap');
				hideHint();
				if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint') {
					navigateByTo('order','current');
					addToExperiencePath('doubleTap');
				}
			}
		});


		swipeDown = ()=>{
			if (!$._data( this.$('.page')[0], 'events' ).swipeDown) {
				// console.log('binding');
				pgn.one('swipeDown', function(){
					GAnalytics.event('portfolio', 'swipe', 'down');
					hideHint();
					if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint') {
						navigateByTo('time','prev');
						addToExperiencePath('swipeVertical');
						win.scrollTop(0);
					}
				});
			}
		};

		swipeUp = ()=>{
			if (!$._data( this.$('.page')[0], 'events' ).swipeUp) {
				// console.log('binding');
				pgn.one('swipeUp', function(){
					GAnalytics.event('portfolio', 'swipe', 'up');
					hideHint();
					if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint') {
						navigateByTo('time','next');
						addToExperiencePath('swipeVertical');
						win.scrollTop(0);
					}
				});
			}
		};
			
		interval = Meteor.setInterval(function () {
			let p_hgh = pgn.height(),
				w_hgh = win.height(),
				s_top = win.scrollTop();
			
			if (w_hgh<p_hgh-10) {
				if (s_top>0) {
					if ($._data( this.$('.page')[0], 'events' ).swipeDown) {
						pgn.off('swipeDown');
					}
					if (p_hgh - w_hgh <= s_top+10) {
						// console.log(p_hgh,w_hgh,s_top);
						swipeUp();
					}
				}else{
					if ($._data( this.$('.page')[0], 'events' ).swipeUp) {
						pgn.off('swipeUp');
					}
					swipeDown();
				}
			}else{
				swipeUp();
				swipeDown();
			}

		}, 250);
	}
	
	Tracker.autorun(()=>{
		if(this.ready.get()===true){
			dynamicColor(this);

			// hints
			let route = FlowRouter.getRouteName();
			Meteor.clearTimeout(hintTimeout[0]);
			Meteor.clearTimeout(hintTimeout[1]);
			hintTimeout[0] = Meteor.setTimeout(function () {
				showHint();
				hintTimeout[1] = Meteor.setTimeout(function () {
					hideHint();
				}, 10000);
			}, 8000);
		}
	});

	Tracker.autorun(()=>{
		if (this.ready.get()===true) {

			if(Session.get('current-project')){
				if (FlowRouter.getRouteName() === 'portfolio.project' || FlowRouter.getRouteName() === 'portfolio.project.page') {
					currentPath.set(Session.get('current-project'), true);
					if (Session.get('consent') && Session.get('consent') != 'opt-out') {
						if (Cookie.get('a_nvlkv_path')) {
							let projectsVisited = Cookie.get('a_nvlkv_path').split('|');
							let has_project_id;
							let current_project_id = Session.get('current-project');
							$.each(projectsVisited, function(index, val) {
								if (!has_project_id) {
									has_project_id = current_project_id == val;
								}
							});
							if (!has_project_id) {
								projectsVisited.push(Session.get('current-project'));
								Cookie.set('a_nvlkv_path',projectsVisited.join('|'));
							}
						}else{
							Cookie.set('a_nvlkv_path', Session.get('current-project'));
						}
					}
				}
			}

			if (FlowRouter.getRouteName() === 'portfolio') {
				let validPath =[];
				$.each(totalPath.keys, function(index, key) {
					if (currentPath.keys[index]) {
						validPath.push(true);
					}
				});

				if (validPath.every(elem => elem === true)) {
					Session.set('path-status', 'finished');
				}
			}

			if (navigationPath.get('continuous')===true) {
				Session.set('show-back-cover', true);
			}else{
				Session.set('show-back-cover', false);
			}
		}
	});
});

Template.portfolio.onDestroyed(function(){
	portfolioHotKeys.unload();
	Meteor.clearInterval(interval);
	Meteor.clearTimeout(hintTimeout[0]);
	Meteor.clearTimeout(hintTimeout[1]);
	Session.set('show-back-cover', false);
});

Template.portfolio.events({
	'click .js_next_by_order': function () {
		navigateByTo('order', 'next');
	},
	'click .js_prev_by_order': function () {
		navigateByTo('order', 'prev');
	}
});