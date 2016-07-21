Template.coverPage.onCreated(function(){
	this.autorun(()=>{
		if (Session.get('current-project')||Session.get('current-category')) {
			Session.set('current-category', undefined);
			Session.set('current-project', undefined);
		}

		this.ready.set(true);
	});
});

Template.backCover.onCreated(function(){
	this.autorun(()=>{
		if (Session.get('current-project')||Session.get('current-category')) {
			Session.set('current-category', undefined);
			Session.set('current-project', undefined);
		}

		this.ready.set(true);
	});
});

Template.backCover.onRendered(function(){
	ABTest.finish('Visual Code');
	GAnalytics.event('back-cover', 'rendered', Session.get('consent'));
});

Template.coverPage.helpers({
	cover: function () {
		let cover = Covers.findOne({isBack:false}, {sort:{dateOfIssue:-1}});
		
		return cover;
	},
	
});

Template.backCover.helpers({
	cover: function () {
		let cover = Covers.findOne({isBack:true}, {sort:{dateOfIssue:-1}});
		
		return cover;
	}
});

Template.backCover.onDestroyed(function(){
	Session.set('show-back-cover', false);
	navigationPath.set('continuous', false);
});

Template.coverNav.helpers({
	coverPageButtonUrl: function(){
		let current_category = Categories.findOne({},{sort:{order:1}});
		if (current_category) {
			let params = {
				category: current_category.slug
			};
			return FlowRouter.path('portfolio.category', params);
		}
	},
});

// backCover.events in forms.js

