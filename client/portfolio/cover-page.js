Template.coverPage.onCreated(function(){
	this.autorun(()=>{
		if (Session.get('current-project')||Session.get('current-category')) {
			Session.set('current-category', undefined);
			Session.set('current-project', undefined);
		}

		this.ready.set(true);
	});
});

// Template.coverPage.onRendered(function(){
// 	if(this.ready.get())
// 		dynamicColor(this);
// });

Template.coverPage.helpers({
	cover: function () {
		let cover = Covers.findOne({isBack:false}, {sort:{dateOfIssue:-1}});
		
		return cover;
	},
	
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