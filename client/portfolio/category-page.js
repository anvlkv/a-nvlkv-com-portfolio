Template.categoryPage.onCreated(function(){
	this.getCurrent_Category = ()=>{
	    if (FlowRouter.getParam("category")) {
		    let req = FlowRouter.current().params;
	    	
	    	let category = Categories.findOne({slug:req.category});
	    	
	    	if (category) {
		    	Session.set('current-category', category._id);
		    	Session.set('current-page-title', category.title);
		    	// reset 'current-project'
		    	if (Session.get('current-project') && !req.project) {
		    		Session.set('current-project', undefined);
		    		Session.set('current-page', undefined);
		    	}
				return category._id;
	    	}
	    }
	};

	this.autorun(()=>{
		let	cat =  CategorySubs.subscribe('Category', this.getCurrent_Category()),
			prj = ProjectSubs.subscribe('ProjectsListWithinCategory', this.getCurrent_Category()),
			att = AttachementSubs.subscribe('AttachementsWithinCategory', this.getCurrent_Category());

		this.ready.set(cat.ready() && prj.ready() && att.ready());
	});
});

Template.categoryPage.onDestroyed(function(){
	Session.set('current-page-title', null);
});

Template.categoryPage.onRendered(function(){
	if (this.ready.get())
		dynamicColor(this);
	
});

Template.categoryPage.helpers({
	category: function(){
		// console.log('category helper called');
	    // category in portfolio
	    let category = Categories.findOne(Session.get('current-category'));

	    if (visual_code === 'bw') {
	    	category.color = '#f7f7f7';
	    }

	    return category;
	},
	projects: function(){
		return Projects.find(
			{$or:[{primaryCategory: Session.get('current-category')}, {secondaryCategory: Session.get('current-category')},]},
			{sort:{order:1}});
	},
	attachements: function(){
		return Attachements.find({$or:[{primaryCategory: Session.get('current-category')}, {secondaryCategory: Session.get('current-category')},]});
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
		return file.original.name;
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
		if (id==Session.get('current-category')) {
			return true;
		}
	}
});


Template.categoryPage.events({
	'click .file_download': function (e) {
		if (!Modernizr.adownload) {
			if ($(e.target).siblings('.hint').length < 1) {
				$('<span class="hint">Right-click and select "Download Linked File"</>').insertAfter($(e.target).siblings('h4'));
			}
			return false;
		}
	},

});