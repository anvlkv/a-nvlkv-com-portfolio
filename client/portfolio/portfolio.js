navigationPath = new ReactiveDict();

let currentPath = new ReactiveDict();
let totalPath = new ReactiveDict();
let navigationMap ={};

function navigationURL (axis, direction){
	// if (!navigationMap.feed || !navigationMap.detailedFeed || !!navigationMap.timeline) {
	// 	return;
	// }
	// console.log(navigationMap);
	let path,
		current = [navigationMap.feed.indexOf(FlowRouter.current().path), navigationMap.detailedFeed.indexOf(FlowRouter.current().path), navigationMap.timeline.indexOf(FlowRouter.current().path)];

		if ((current[0] < 0 || current[2] < 0) && current[1] >= 0) {
			let closest;
			if (FlowRouter.current().params.project) {
				closest =  FlowRouter.path('portfolio.project', {
					project: FlowRouter.current().params.project,
					category: FlowRouter.current().params.category,
				});
			} else {
				let i = 0,
					cat = FlowRouter.current().params.category;
				do{
					let path = navigationMap.feed[i];
					if (path.indexOf(cat) >= 0) {
						closest = path;
					}

					i++;

				}while (i <= navigationMap.timeline.length && !closest);
			}

			if (closest) {
				if (current[0]<0) {
					current[0]=navigationMap.feed.indexOf(closest);
				}

				if (current[2]<0) {
					current[2]=navigationMap.timeline.indexOf(closest);
				}

			}

			// console.log(navigationMap.feed, navigationMap.timeline, closest);
			
		}

	// console.log(current);

	switch (axis){
		case 'time':
			// console.log(now);
			switch (direction){
				case 'next':
					
					if (current[2] >= 0 && navigationMap.timeline[current[2]+1]) {
						path = navigationMap.timeline[current[2]+1];
					} else if (!navigationMap.timeline[current[2]+1] || !current[2] || current[2] < 0){
						path = navigationMap.timeline[0];
					}
					break;
				case 'prev':
					if (current[2] >= 0 && navigationMap.timeline[current[2]-1]) {
						path = navigationMap.timeline[current[2]-1];
					} else if (!navigationMap.timeline[current[2]-1] || !current[2] || current[2] < 0){
						path = navigationMap.timeline[navigationMap.timeline.length - 1];
					}
					break;
				default:
					break;
			}
			break;
		case 'order':
			// console.log(current);
			switch (direction){
				case 'next':
					if (current[0] >= 0 && navigationMap.feed[current[0]+1]) {
						path = navigationMap.feed[current[0]+1];
					} else if (!navigationMap.feed[current[0]+1] || !current[0]){
						path = navigationMap.feed[0];
					}
					break;
				case 'prev':
					if (current[0] >= 0 && navigationMap.feed[current[0]-1]) {
						path = navigationMap.feed[current[0]-1];
					} else if (!navigationMap.feed[current[0]-1] || !current[0]){
						path = navigationMap.feed[navigationMap.feed.length - 1];
					}
					break;
				case 'current':
					// console.log(navigationMap.detailedFeed[current[1]]);
					if (current[1] >= 0 && navigationMap.detailedFeed[current[1]+1]) {
						path = navigationMap.detailedFeed[current[1]+1];
					} else if (!navigationMap.detailedFeed[current[1]+1] || !current[1]){
						path = navigationMap.detailedFeed[0];
					}
					break;
				default:
					break;
			}
	}

	// console.log(path);
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

			if (navigationPath.get('axis') === axis && navigationPath.get('direction') !== direction) {
				navigationPath.set('backwards', true);
			}else{
				navigationPath.set('backwards', false);
			}


			if (Session.get('consent') && Session.get('consent') !== 'opt-out') {
				let interruption = '';
				if (navigationPath.get('axis') !== axis) {
					interruption += navigationPath.get('axis') + '-' + axis + '|';
				}
				if (navigationPath.get('direction') !== direction) {
					interruption += navigationPath.get('direction') + '-' + direction + '|';
				}
				GAnalytics.event(FlowRouter.current().path, 'path-interrupted', interruption);
			}
			

			navigationPath.set('direction', direction);
			navigationPath.set('axis', axis);
		}
	}

	// console.log(navigationURL(axis, direction));
	FlowRouter.go(navigationURL(axis, direction));
}

FlowRouter.triggers.enter([function(context, redirect){
	if (Session.get('path-status')!=='finished') {
		let url = navigationURL(navigationPath.get('axis'), navigationPath.get('direction'));

		if (!url) {
			if (navigationMap.feed) {
				url = navigationMap.feed[0];
			} else {
				url = '/portfolio';
			}
		}

		redirect(url);
	}
}],{only:['portfolio.back-cover']});


Template.registerHelper('dateMY', function(date){
	return moment(date).format('MMM YYYY');
});

Template.registerHelper('sameDateMY', function(date1, date2){
	return moment(date1).format('MMM YYYY') === moment(date2).format('MMM YYYY');
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
	        navigateByTo('time','next');
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
	        navigateByTo('time','prev');
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
	        navigateByTo('order','next');
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
	        navigateByTo('order','prev');
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
		
		let cat = PortfolioSubs.subscribe('CategoriesList'),
			prj = PortfolioSubs.subscribe('ProjectsFeed'),
			cvr = PortfolioSubs.subscribe('ActiveCovers');

		this.ready.set(cat.ready() && prj.ready() && cvr.ready());
	});


	this.autorun(()=>{
		if (this.ready.get()===true && !navigationMap.timeline ) {
			let current = {
				category: FlowRouter.current().params.category,
				project: FlowRouter.current().params.project,
				page: FlowRouter.current().params.page
			};

			navigationMap.timeline =['/portfolio'];
			navigationMap.feed =['/portfolio'];
			navigationMap.detailedFeed =['/portfolio'];

			Categories.find({}, {sort:{order:1}}).forEach(function (category) {
				
				navigationMap.feed.push(FlowRouter.path('portfolio.category', {category: category.slug}));

				navigationMap.detailedFeed.push(FlowRouter.path('portfolio.category', {
						category: category.slug,
					}));
				


				Projects.find({primaryCategory: category._id}, {sort:{order:1}}).forEach(function (project) {

					navigationMap.feed.push(FlowRouter.path('portfolio.project',{
						category: category.slug,
						project: project.slug,
					}));
					navigationMap.detailedFeed.push(FlowRouter.path('portfolio.project', {
						category: category.slug,
						project: project.slug,
					}));

					if (project.pages) {
						$.each(project.pages, function(index, page) {
							// console.log(page);

							navigationMap.detailedFeed.push(FlowRouter.path('portfolio.project.page', {
								category: category.slug,
								project: project.slug,
								page: page.slug
							}));

						});
					}

				});

			});

			Projects.find({}, {sort:{endDate:-1}}).forEach(function (project) {
				// navigationMap.timeline.push([project.primaryCategory, project._id]);
				navigationMap.timeline.push(FlowRouter.path('portfolio.project',{
					category: Categories.findOne({_id:project.primaryCategory}).slug,
					project: project.slug
				}));
			});



			navigationMap.timeline.push('/portfolio/thank-you');
			navigationMap.feed.push('/portfolio/thank-you');
			navigationMap.detailedFeed.push('/portfolio/thank-you');

			// console.log(navigationMap);
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
					navigateByTo('time','next');
					addToExperiencePath('swipeHorizontal');
				}
			},
			swipeRight: function(event, direction){
				GAnalytics.event('portfolio', 'swipe', direction);
				hideHint();
				if (!Session.get('active-overlay') || Session.get('active-overlay')==='hint') {
					navigateByTo('time','prev');
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
	},
	'click .js_next_by_time': function () {
		navigateByTo('time', 'next');
	},
	'click .js_prev_by_time': function () {
		navigateByTo('time', 'prev');
	},
});