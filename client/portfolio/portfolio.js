navigationPath = new ReactiveDict();

let currentPath = new ReactiveDict();
let totalPath = new ReactiveDict();
let navigationMap ={};


function slugify (object){
	// console.log(object);
	if (object) {
		return object.slug;
	} else {
		return undefined;
	}
}

function navigationOBJ (axis, direction){
	// let current_project = Projects.findOne(Session.get('current-project')),
	// current_category = Categories.findOne(Session.get('current-category')),
	params={};

	// console.log(arguments);
	switch (axis){
		case 'time':
			let now;

			$.each(navigationMap.timeline, function(index, val) {

				if (!now && val[0]===navigationMap.current[0] && val[1]===navigationMap.current[1]) {
					now = index;
				} else if (!now && val[0]===navigationMap.current[0]){
					now = index;
				}

			});
			
			// console.log(now);
			switch (direction){
				case 'next':
					if(!now){
						params.category = navigationMap.timeline[0][0];
						params.project = navigationMap.timeline[0][1];
					}else if (navigationMap.timeline[now+1]) {
						params.category = navigationMap.timeline[now+1][0];
						params.project = navigationMap.timeline[now+1][1];
					}
					break;
				case 'prev':
					if(!now){
						params.category = navigationMap.timeline[navigationMap.timeline.length - 1][0];
						params.project = navigationMap.timeline[navigationMap.timeline.length - 1][1];
					}else if (navigationMap.timeline[now-1]) {
						params.category = navigationMap.timeline[now-1][0];
						params.project = navigationMap.timeline[now-1][1];
					}
					break;
				default:
					break;
			}
			break;
		// case 'order':
		// 	switch (direction){
		// 		case 'next':
		// 			if (current_project) {
		// 				params.project = Projects.findOne({order: {$gt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
		// 				if (params.project) {
		// 					params.project = params.project._id;
		// 					params.category = current_category._id;
		// 				}
		// 			} else if (current_category){
		// 				params.project = Projects.findOne({primaryCategory: current_category._id},{sort:{order:1}});
		// 					if (params.project) {
		// 						params.project = params.project._id;
		// 					}
		// 				params.category = current_category._id;
		// 			}

		// 			// navigate to next category
		// 			if (!params.project && !params.category) {
		// 				if (current_category) {
		// 					params.category = Categories.findOne({order: {$gt: current_category.order}},{sort:{order:1}});
		// 				} else {
		// 					params.category = Categories.findOne({},{sort:{order:1}});
		// 				}
						
		// 				if (params.category) {
		// 					params.category = params.category._id;
		// 				}
						
		// 			}
		// 			break;
		// 		case 'prev':
		// 			if (current_project) {
		// 				params.project = Projects.findOne({order: {$lt: current_project.order}, primaryCategory: current_category._id},{sort:{order:1}});
		// 				if (params.project) {
		// 					params.project = params.project._id;
		// 				}
		// 				params.category = current_category._id;
		// 			} else if (current_category){

		// 				let prev_category_by_order = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:-1}});
		// 				if (prev_category_by_order) {
		// 					params.project = Projects.findOne({primaryCategory: prev_category_by_order._id},{sort:{order:-1}});
		// 						if (params.project) {
		// 							params.project = params.project._id;
		// 						}
		// 					params.category = prev_category_by_order._id;
		// 				}

		// 			}

		// 			// navigate to prev category
		// 			if (!params.project && !params.category) {
		// 				if (current_category) {
		// 					params.category = Categories.findOne({order: {$lt: current_category.order}},{sort:{order:-1}});
		// 				} else {
		// 					params.category = Categories.findOne({},{sort:{order:-1}});
		// 				}


		// 				if (params.category) {
		// 					params.category = params.category._id;

		// 					let prev_project_by_order = Projects.findOne({primaryCategory: params.category},{sort:{order:-1}});

		// 					if (prev_project_by_order) {
		// 						params.project = prev_project_by_order._id;
		// 					}
		// 				}
						
		// 			}
		// 			break;
		// 		case 'current':
		// 			if (current_project) {
		// 				if (current_project.pages && Session.get('current-page')) {
		// 					for (var i = 0; i < current_project.pages.length; i++) {
		// 						if (current_project.pages[i].slug == Session.get('current-page') && current_project.pages.length - 1 > i){
		// 							params.page = current_project.pages[i+1].slug;
		// 							params.project = current_project._id;
		// 							params.category = current_category._id;
		// 						} else if (current_project.pages.length - 1 == i && !params.page) {
		// 							// console.log(current_project, '1');
		// 							return navigationOBJ('order', 'next');
		// 						}
		// 					}
		// 				} else if (current_project.pages) {
		// 					params.page = current_project.pages[0].slug;
		// 					params.project = current_project._id;
		// 					params.category = current_category._id;
		// 					// console.log(params, '0');
		// 				} else {
		// 					// console.log(current_project, '2');
		// 					return navigationOBJ('order', 'next');
		// 				}
		// 			} else {
		// 				// console.log(current_project, '3');
		// 				return navigationOBJ('order', 'next');
		// 			}
		// 			break;
		// 	}
		// 	// break;
	}
	// console.log(params);
	return params;
}

function navigationURL (axis, direction){

	let params = navigationOBJ(axis, direction);
	// console.log(params);


	params = {
		project: slugify(Projects.findOne({_id:params.project})),
		category: slugify(Categories.findOne({_id:params.category})),
		page: params.page
	};

	// console.log(params);
	let path;
	if (params.project && params.category && params.page) {
		path = FlowRouter.path('portfolio.project.page', params);
	} else if (params.project && params.category) {
		path = FlowRouter.path('portfolio.project', params);
	} else if (params.category){
		path = FlowRouter.path('portfolio.category', params);
	} else {
		path = FlowRouter.path('portfolio');
	}

	console.log(path);
	return path;

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

	// navigationURL(axis, direction);
	FlowRouter.go(navigationURL(axis, direction));
}


Template.registerHelper('dateMY', function(date){
	return moment(date).format('MMM YYYY');
});

Template.registerHelper('dateY', function(date){
	return moment(date).format('YYYY');
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
	        // console.log(navigationOBJ('order','current'));
	        // console.log(navigationURL('order','current'));
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
	});


	this.autorun(()=>{
		if (this.ready.get()===true) {
			let current = {
				category: FlowRouter.current().params.category,
				project: FlowRouter.current().params.project,
				page: FlowRouter.current().params.page
			};

			navigationMap.timeline =[];
			navigationMap.feed =[];
			navigationMap.current =[];

			Categories.find({}, {sort:{order:1}}).forEach(function (category) {
				let projects = [];

				if (current.category === category.slug) {
					navigationMap.current[0]=category._id;
				}
				
				Projects.find({primaryCategory: category._id}, {sort:{order:1}}).forEach(function (project) {
					let pages = [];


					if (navigationMap.current[0]===category._id && current.project === project.slug) {
						navigationMap.current[1]=project._id;
					}

					if (project.pages) {
						$.each(project.pages, function(index, val) {

							if (navigationMap.current[0]===category._id && navigationMap.current[1]===project._id && current.page === val.slug) {
								navigationMap.current[2]=val.slug;
							}

							pages.push(index);
						});
					}

					projects.push([project._id, pages]);

				});

				navigationMap.feed.push([category._id, projects]);


			});

			Projects.find({}, {sort:{endDate:-1}}).forEach(function (project) {
				navigationMap.timeline.push([project.primaryCategory, project._id]);
			});


			// console.log(navigationMap.current);
		}
	});

	this.autorun(()=>{
		if (this.ready.get()===true && (FlowRouter.getParam('category')||FlowRouter.getParam('project')||FlowRouter.getParam('page'))) {
			navigationMap.current[0]=Session.get('current-category');
			navigationMap.current[1]=Session.get('current-project');
			navigationMap.current[2]=Session.get('current-page');
			console.log(navigationMap.current);
		}
	});

	this.autorun(()=>{
			if (this.ready.get()===true) {
			
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
	
	this.autorun(()=>{
		if(this.ready.get()===true){
			dynamicColor(this);

			// hints
			let route = FlowRouter.getRouteName();
			Meteor.clearTimeout(hintTimeout[0]);
			Meteor.clearTimeout(hintTimeout[1]);
			let timing = {
				start: 8000,
				end: 10000,
			};
			if (FlowRouter.getRouteName() === 'portfolio') {
				timing.start = 16000;
			}
			
			hintTimeout[0] = Meteor.setTimeout(function () {
				showHint();	
				hintTimeout[1] = Meteor.setTimeout(function () {
					hideHint();
				}, timing.end);
			}, timing.start);
		}
	});

	this.autorun(()=>{
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

			let validPath =[];
			$.each(totalPath.keys, function(index, key) {
				if (currentPath.keys[index]) {
					validPath.push(true);
				}else{
					validPath.push(false);
				}
			});

			if (validPath.every(elem => elem === true)) {
				Session.set('path-status', 'finished');
			}

			if (navigationPath.get('continuous')===true && Session.get('path-status')==='finished' && Session.get('show-back-cover') !== true) {
				Session.set('show-back-cover', true);
			}else{
				Session.set('show-back-cover', false);
			}
		}
	});

	this.autorun(()=>{
		if (this.ready.get()===true) {
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
	},
	'click .js_current_by_order': function () {
		navigateByTo('order', 'current');
	}
});