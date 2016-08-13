Template.categorySlide.onCreated(function(){
	this.autorun(()=>{
		// console.trace(typeof currentState.get('category-id'));
		if (currentState.get('category-id')) {
			let	cat = CategorySubs.subscribe('Category', currentState.get('category-id')),
				prj = CategorySubs.subscribe('ProjectsListWithinCategory', currentState.get('category-id')),
				att = CategorySubs.subscribe('AttachementsWithinCategory', currentState.get('category-id'));

			this.ready.set(cat.ready() && prj.ready() && att.ready());
		}
	});

	this.autorun(()=>{
		if (this.ready.get()) {
			Session.set('current-page-title', Categories.findOne(currentState.get('category-id')).title);
		}
	});
});

Template.categorySlide.onDestroyed(function(){
	Session.set('current-page-title', null);
});

Template.categorySlide.onRendered(function(){

});

Template.categorySlide.helpers({
	category: function(){
		// console.log('category helper called');
	    // category in portfolio
	    let category = Categories.findOne(currentState.get('category-id'));

	    if (visual_code === 'bw') {
	    	category.color = '#f7f7f7';
	    }

	    return category;
	},
	projects: function(){
		return Projects.find(
			{$or:[{primaryCategory: currentState.get('category-id')}, {secondaryCategory: currentState.get('category-id')},]},
			{sort:{order:1}});
	},
	attachements: function(){
		return Attachements.find({$or:[{primaryCategory: currentState.get('category-id')}, {secondaryCategory: currentState.get('category-id')},]});
	},
	url: function (project) {
		let params = {
			category: Categories.findOne(project.primaryCategory).slug,
			project: project.slug
		};
		return FlowRouter.path('portfolio.project', params);
	},
	typeIs: function(item, type){
		return item.type == type;
	},
	filename: function(fileId){
		let file = Files.findOne({_id:fileId});
		// console.log(file);
		if (file) {
			return file.original.name;		
		}
	},
});

Template.categoryCoverMenu.helpers({
	url: function (category){
		let params = {
			category: category.slug,
		};
		return FlowRouter.path('portfolio.category', params);
	},
	categories: function () {
		return Categories.find({},{sort:{order:1}});
	},
	isCurrentCategory: function(id){
		if (id==currentState.get('category-id')) {
			return true;
		}
	}
});


Template.categorySlide.events({
	'click .file_download': function (e) {
		if (!Modernizr.adownload) {
			if ($(e.target).siblings('.hint').length < 1) {
				$('<span class="hint">Right-click and select "Download Linked File"</>').insertAfter($(e.target).siblings('h4'));
			}
			return false;
		}
	},

});