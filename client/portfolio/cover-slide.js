Template.coverSlide.onCreated(function(){
	this.autorun(()=>{
		// if (Session.get('current-project')||Session.get('current-category')) {
		// 	Session.set('current-category', undefined);
		// 	Session.set('current-project', undefined);
		// }

		this.ready.set(true);
	});
});

Template.backCover.onCreated(function(){
	this.autorun(()=>{
		// if (Session.get('current-project')||Session.get('current-category')) {
		// 	Session.set('current-category', undefined);
		// 	Session.set('current-project', undefined);
		// }

		this.ready.set(true);
	});
});

Template.backCover.onRendered(function(){
	ABTest.finish('Visual Code');
	GAnalytics.event('back-cover', 'rendered', Session.get('consent'));
});

Template.backCover.inheritsHelpersFrom('date');


Template.coverSlide.helpers({
	cover: function () {
		let cover = Covers.findOne({isBack:false}, {sort:{dateOfIssue:-1}});
		
		return cover;
	},
	entrances: function(){

		let entrances = [{
			direction:{
				name: 'left',
				transform: 'rotate(180deg)'
			},
			title: navigationMap.timeline.years[navigationMap.timeline.years.length - 1],
			link: FlowRouter.path('portfolio.year', {year:navigationMap.timeline.years[navigationMap.timeline.years.length - 1]}),
			navHints:[
				'swipeRight',
				'arrowKeyLeft',
			]
		},{
			direction:{
				name: 'up',
				transform: 'rotate(-90deg)'
			},
			title: Categories.findOne(navigationMap.feed.categories[navigationMap.feed.categories.length - 1]).title,
			link: FlowRouter.path('portfolio.category', {category:Categories.findOne(navigationMap.feed.categories[navigationMap.feed.categories.length - 1]).slug}),
			navHints:[
				'swipeDown',
				'arrowKeyUp',
			]
		},{
			direction:{
				name: 'right',
				transform: 'rotate(0deg)'
			},
			title: navigationMap.timeline.years[0],
			link: FlowRouter.path('portfolio.year', {year:navigationMap.timeline.years[0]}),
			navHints:[
				'swipeLeft',
				'arrowKeyRight',
			]
		},{
			direction:{
				name: 'down',
				transform: 'rotate(90deg)'
			},
			title: Categories.findOne(navigationMap.feed.categories[0]).title,
			link: FlowRouter.path('portfolio.category', {category:Categories.findOne(navigationMap.feed.categories[0]).slug}),
			navHints:[
				'swipeUp',
				'arrowKeyDown',
			]
		}];

		return entrances;
	}
	
});

Template.coverSlide.events({
	'click .entrance_link': function (e, t) {
		navigationPath.visualDirection = $(e.target).data('direction');
	}
});

Template.backCover.helpers({
	cover: function () {
		let cover = Covers.findOne({isBack:true}, {sort:{dateOfIssue:-1}});
		
		return cover;
	}
});

Template.backCover.onDestroyed(function(){
	Session.set('show-back-cover', false);
	navigationPath.continuous = false;
});

