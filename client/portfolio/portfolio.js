let currentPath = new ReactiveDict();
let totalPath = new ReactiveDict();

function navigateByTo (axis, direction){
	let queue, index, destiny, type;
	switch(axis){
		case 'feed':
			if (currentState.get('project-id')){
				queue = navigationMap.feed.projects;
				index = queue.indexOf(currentState.get('project-id'));
				type = 'project';
			} else {
				queue = navigationMap.feed.categories;
				type = 'category';
				if (currentState.get('category-id')) {
					index = queue.indexOf(currentState.get('category-id'));
				}
			}
			
			break;

		case 'timeline':

			if (currentState.get('project-id')) {
				queue = navigationMap.timeline.projects;
				index = queue.indexOf(currentState.get('project-id'));
				type = 'date';
			} else {
				queue = navigationMap.timeline.years;
				type = 'year';
				if (currentState.get('year')) {
					$.each(queue, function(i, year) {
						if (year == currentState.get('year')) {
							index = i;
						}
					});
				}
			}
			
			break;

		case 'depth':
			if (currentState.get('project-id')) {
				queue = navigationMap.depth.projects[currentState.get('project-id')];
				if (currentState.get('year')) {
					type = 'date.page';
				} else {
					type = 'project.page';
				}
				if (currentState.get('project-page-slug')) {
					index = queue.indexOf(currentState.get('project-page-slug'));
				}
			} else if (currentState.get('category-id')) {
				queue = navigationMap.depth.categories[currentState.get('category-id')];
				type = 'project';
			} else if (currentState.get('year')) {
				queue = navigationMap.depth.years[currentState.get('year')];
				type = 'date';
			} else {
				queue = navigationMap.feed.categories;
				type = 'category';
			}
			break;
	}

	// console.log(index, queue);

	switch(direction){
		case'next':
			if (index>=0) {
				if (queue[index+1]) {
					destiny=queue[index+1];
				}
			} else {
				destiny=queue[0]
			}
			break;
		case'prev':
			if (index>=0) {
				if (queue[index-1]) {
					destiny=queue[index-1];
				}
			} else {
				destiny=queue[queue.length-1];
			}
			break;
	}

	if ((destiny && type)||(type==='project.page'||type==='date.page')) {
		let cat, prj, yr, params = {}, queryParams = {};

		switch(type){
			case 'category':
				cat = Categories.findOne(destiny);
					params.category = cat.slug;
				break;
			case 'year':
				params.year = destiny;
				break;
			case 'project':
				prj = Projects.findOne(destiny);
				cat = Categories.findOne(prj.primaryCategory);
				if (prj && cat) {
					params.category = cat.slug;
					params.project = prj.slug;
				}
				break;
			case 'date':
				prj = Projects.findOne(destiny);
				yr = moment(prj.endDate).format('YYYY');
				if (prj && yr) {
					params.year = yr;
					params.project = prj.slug;
				}
				break;
			case 'project.page':
				params.category = currentState.get('category-slug');
				params.project = currentState.get('project-slug');
				params.page = destiny ? destiny : currentState.get('project-page-slug');
				queryParams = destiny ? {} : {emailOverlay:true};
				break;
			case 'date.page':
				params.year = currentState.get('year');
				params.project = currentState.get('project-slug');
				params.page = destiny ? destiny : currentState.get('project-page-slug');
				queryParams = destiny ? {} : {emailOverlay:true};
				break;
		}

		FlowRouter.go('portfolio.'+type, params, queryParams);

		// console.trace(currentState.all(), queue, index, destiny, type);
	} else {

		if (navigationPath.continuous) {
			FlowRouter.go('portfolio.back-cover');

		}else{
			FlowRouter.go('portfolio');

		}
	}
}




Template.portfolio.onCreated(function(){

	this.hotkeys = new Hotkeys({
		autoLoad:false
	});

	this.hotkeys.add({
		combo:'right',
		callback : function(){
			GAnalytics.event('portfolio','key-press', 'right');
			hideHint();
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay'){
		        navigationPath.visualDirection = 'right';
		        navigateByTo('timeline','next');
		        
		        addToExperiencePath('keysHorizontal');
		    }
	    }
	});
	this.hotkeys.add({
		combo:'left',
		callback : function(){
			GAnalytics.event('portfolio','key-press', 'left');
			hideHint();
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay'){
		        navigationPath.visualDirection = 'left';
		        navigateByTo('timeline','prev');
		        
		        addToExperiencePath('keysHorizontal');
		    } 
	    }
	});
	this.hotkeys.add({
		combo:'down',
		callback : function(){
			GAnalytics.event('portfolio','key-press', 'down');
			hideHint();
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay'){
		        navigationPath.visualDirection = 'down';
		        navigateByTo('feed','next');
		        
		        addToExperiencePath('keysVertical');
		    } 
	    }
	});
	this.hotkeys.add({
		combo:'up',
		callback : function(){
			GAnalytics.event('portfolio','key-press', 'up');
			hideHint();
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay'){
		        navigationPath.visualDirection = 'up';
		        navigateByTo('feed','prev');
		        
		        addToExperiencePath('keysVertical');
		    } 
	    }
	});

	this.hotkeys.add({
		combo:'enter',
		callback : ()=>{
			GAnalytics.event('portfolio','key-press', 'enter');
			hideHint();
			if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay'){
		        navigationPath.visualDirection = 'down';
		        navigateByTo('depth','next');

		        addToExperiencePath('keyEnter');
		    } 
	    }
	});

	this.autorun(()=>{
		
		let cat = PortfolioSubs.subscribe('CategoriesList'),
			prj = PortfolioSubs.subscribe('ProjectsFeed'),
			cvr = PortfolioSubs.subscribe('ActiveCovers');

		this.ready.set(cat.ready() && prj.ready() && cvr.ready());
	});


	this.autorun(()=>{
		if (this.ready.get()===true && Object.keys(navigationMap).length===0) {
			navigationMap.feed={};
			navigationMap.timeline={};
			navigationMap.depth={};
			navigationMap.depth.categories={};
			navigationMap.depth.years={};
			navigationMap.depth.projects={};
			navigationMap.feed.categories=[];
			navigationMap.timeline.years=[];
			navigationMap.feed.projects=[];
			navigationMap.timeline.projects=[];

			Categories.find({}, {sort:{order:1}}).forEach(function (category) {
				
				navigationMap.feed.categories.push(category._id);

				Projects.find({primaryCategory: category._id}, {sort:{order:1}}).forEach(function (project, index) {
					if (index === 0) {
						navigationMap.depth.categories[category._id]=[project._id];
					}
				
					navigationMap.depth.projects[project._id]=[]

					if (project.pages) {
						$.each(project.pages, function(index, page) {
							navigationMap.depth.projects[project._id].push(page.slug)
						});
					}
					

					navigationMap.feed.projects.push(project._id);
				});

			});

			Projects.find({}, {sort:{endDate:-1}}).forEach(function (project) {
				let projectYear = moment(project.endDate).format('YYYY');

				if (!CC_Years.findOne({year:projectYear})) {
					CC_Years._collection.insert({
						year:projectYear,
						projects: [project._id]
					});
					navigationMap.depth.years[projectYear]=[project._id];
					navigationMap.timeline.years.push(projectYear);
				} else {
					CC_Years._collection.update({year:projectYear}, {$push:{projects:project._id}});
				}


				navigationMap.timeline.projects.push(project._id);
			});

			let step = 0.3 / CC_Years.find().count(),
				years=[];
			CC_Years.find().forEach(function (year, index) {
				// console.log(step*(index+1));
				year.color = colorLuminance('#9067f7', -step*(index+1));
				years.push(year);
			});

			$.each(years, function(index, val) {
				CC_Years._collection.update({_id:val._id}, val);
			});

			// console.log(navigationMap);

		}
	});


	this.autorun(()=>{
		FlowRouter.watchPathChange();
		if(FlowRouter.getParam('category') && this.ready.get()===true){
			let cat = Categories.findOne({slug:FlowRouter.current().params.category});
			if (cat) {
				currentState.set('category-id', cat._id);
				currentState.set('category-slug', cat.slug);
				currentState.set('year', null);
			}
		} else if (FlowRouter.getParam('year')){
			currentState.set('year', FlowRouter.current().params.year);
			currentState.set('category-id', null);
			currentState.set('category-slug', null);
		} else {
			currentState.set('year', null);
			currentState.set('category-id', null);
			currentState.set('category-slug', null);
		}
	});

	this.autorun(()=>{
		FlowRouter.watchPathChange();
		if (FlowRouter.getParam('project') && this.ready.get()===true) {
			let prj = Projects.findOne({slug:FlowRouter.current().params.project});
			if (prj) {
				currentState.set('project-id', prj._id);
				currentState.set('project-slug', prj.slug);
			}
		} else {
			currentState.set('project-id', null);
			currentState.set('project-slug', null);
		}
	});

	this.autorun(()=>{
		FlowRouter.watchPathChange();
		if (FlowRouter.getParam('page') && this.ready.get()===true) {
			currentState.set('project-page-slug', FlowRouter.current().params.page);
		} else {
			currentState.set('project-page-slug', null);
		}
	});

});



let interval;
let hintTimeout=[];

Template.portfolio.onRendered(function(){
	// keyboard
	this.hotkeys.load();


	// swiping
	this.autorun(()=>{
		if (this.ready.get()===true && Modernizr.touchevents) {
			let win = $(window),
				pgn = this.$('.controll_wrap');

			// console.log(pgn);

			pgn.swipe({
				swipeLeft: function(event, direction){
					// console.log(direction);


					GAnalytics.event('portfolio', 'swipe', direction);
					hideHint();
					if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay') {
						navigationPath.visualDirection = 'right';
						navigateByTo('timeline','next');
				        
						addToExperiencePath('swipeHorizontal');
					}
				},
				swipeRight: function(event, direction){
					// console.log(direction);

					GAnalytics.event('portfolio', 'swipe', direction);
					hideHint();
					if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay') {
						navigationPath.visualDirection = 'left';
						navigateByTo('timeline','prev');
						
						addToExperiencePath('swipeHorizontal');
					}
				},
			});


			// bind vertical swiping
			swipeDown = ()=>{
				if (!$._data(this.$('.controll_wrap')[0], 'events' ).swipeDown) {
					pgn.one('swipeDown', function(){
						GAnalytics.event('portfolio', 'swipe', 'down');
						hideHint();
						if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay') {
							navigationPath.visualDirection = 'up';
							navigateByTo('feed','prev');
							
							addToExperiencePath('swipeVertical');
							win.scrollTop(0);
						}
					});
				}
			};

			swipeUp = ()=>{
				if (!$._data(this.$('.controll_wrap')[0], 'events' ).swipeUp) {
					pgn.one('swipeUp', function(){
						GAnalytics.event('portfolio', 'swipe', 'up');
						hideHint();
						if (!Session.get('active-overlay') || Session.get('active-overlay')==='hintOverlay') {
							navigationPath.visualDirection = 'down';
							navigateByTo('feed','next');
							
							addToExperiencePath('swipeVertical');
							win.scrollTop(0);
						}
					});
				}
			};
			
			// check if should swipe or scroll
			interval = Meteor.setInterval(function () {
				let p_hgh = pgn.height(),
					w_hgh = win.height(),
					s_top = win.scrollTop();
				
				if (w_hgh<p_hgh-10) {
					if (s_top>0) {
						if ($._data( this.$('.controll_wrap')[0], 'events' ).swipeDown) {
							pgn.off('swipeDown');
						}
						if (p_hgh - w_hgh <= s_top+10) {
							swipeUp();
						}
					}else{
						if ($._data( this.$('.controll_wrap')[0], 'events' ).swipeUp) {
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
	})
	
	
	this.autorun(()=>{
		if(this.ready.get()===true){
			// hints
			let route = FlowRouter.getRouteName();
			Meteor.clearTimeout(hintTimeout[0]);
			Meteor.clearTimeout(hintTimeout[1]);
			let timing_variation = Number.parseInt(ABTest.start("Hint timing", ['4000','8000','16000']));
			let timing = {
				start: timing_variation,
				end: timing_variation*2,
			};
			if (FlowRouter.getRouteName() === 'portfolio') {
				timing.start = timing_variation*2;
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
				navigationPath.continuous = true;
			}
		}
	});
});

Template.portfolio.onDestroyed(function(){
	this.hotkeys.unload();

	Meteor.clearInterval(interval);
	Meteor.clearTimeout(hintTimeout[0]);
	Meteor.clearTimeout(hintTimeout[1]);

	// Session.set('show-back-cover', false);
});

Template.portfolio.events({
	'click .js_next_by_order': function () {
		navigationPath.visualDirection = 'down';
		navigateByTo('feed', 'next');
	},
	'click .js_prev_by_order': function () {
		navigationPath.visualDirection = 'up';
		navigateByTo('feed', 'prev');
	},
	'click .js_next_by_time': function () {
		navigationPath.visualDirection = 'left';
		navigateByTo('timeline', 'next');
	},
	'click .js_prev_by_time': function () {
		navigationPath.visualDirection = 'right';
		navigateByTo('timeline', 'prev');
	},
});