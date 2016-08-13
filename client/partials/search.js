let searchOptions = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
let searchFields = ['title', 'description', 'pages.text', 'startDate', 'endDate'];

ProjectSearch = new SearchSource('projects', searchFields, searchOptions);


Template.searchOverlay.onCreated(function() {
	this.initialQuery = new ReactiveVar();

	this.autorun(()=>{
		let cat = SearchSubs.subscribe('CategoriesList'),
			prj = SearchSubs.subscribe('ProjectsFeed');

		this.ready.set(cat.ready() && prj.ready());

		if (searchQuery.get()) {
			ProjectSearch.search(searchQuery.get());
			this.initialQuery.set(searchQuery.get());
		} else if (FlowRouter.getQueryParam('searchOverlay') && FlowRouter.getQueryParam('searchOverlay')!=='true'){
			ProjectSearch.search(FlowRouter.getQueryParam('searchOverlay'));
			this.initialQuery.set(FlowRouter.getQueryParam('searchOverlay'));
		} else {
			ProjectSearch.search();
		}
	});


	ProjectSearch.search();
});

Template.searchOverlay.onRendered(function() {
	this.autorun(()=>{
		if(this.$('input, textarea').length > 0){
			this.$('input, textarea')[0].focus();
		}
	});
});

Template.searchOverlay.helpers({
	projects: function(){
		return ProjectSearch.getData();
	},
	url: function(project){
		let cat = Categories.findOne(project.primaryCategory).slug;
		if (cat) {
			let params ={
				category: cat,
				project: project.slug,
			}

			return FlowRouter.path('portfolio.project', params);

		}
		
	},
	query: function(){
		return Template.instance().initialQuery.get();
	},
	loading: function(){
		// console.log(); 
		return ProjectSearch.getStatus().loading;
	}
});

Template.searchOverlay.events({
	'submit':function(){
		return false;
	},

	'keyup [name=search]': function(e) {
		let text = $(e.target).val().trim();
		ProjectSearch.search(text);
		searchQuery.set(text);
		FlowRouter.setQueryParams({searchOverlay:text});
	},
});


