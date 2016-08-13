Template.projectSlide.onCreated(function(){

	this.autorun(()=>{
		if (currentState.get('project-id') && currentState.get('category-id')) {

			let prj = ProjectSubs.subscribe('Project', currentState.get('project-id')),
				cat = ProjectSubs.subscribe('Category', currentState.get('category-id'));

			this.ready.set(prj.ready() && cat.ready());
		} else if (currentState.get('project-id') && currentState.get('year')){
			let prj = ProjectSubs.subscribe('Project', currentState.get('project-id'));

			this.ready.set(prj.ready());
		}
	});

	this.autorun(()=>{
		if (this.ready.get()) {
			Session.set('current-page-title', Projects.findOne(currentState.get('project-id')).title);
		}
	})

});


Template.projectSlide.onDestroyed(function(){
	Session.set('current-page-title', null);
});


Template.projectSlide.helpers({
	category: function(){
		let category = Categories.findOne(currentState.get('category-id'));
		return category;
	},
	color: function(){
		if (currentState.get('category-id')) {
			let category = Categories.findOne(currentState.get('category-id'));
			if (category) {
				return category.color;			
			}
		} else if (currentState.get('year')) {
			let year = CC_Years.findOne({year:currentState.get('year')});
			if (year) {
				return year.color;
			}
		}
	},
	project: function(){
		return Projects.findOne(currentState.get('project-id'));
	},
	currentPage: function(){
		let page;
		if (currentState.get('project-page-slug') && CC_Projects_unpublishedFields.findOne(currentState.get('project-id'))) {
			CC_Projects_unpublishedFields.findOne(currentState.get('project-id')).pages.forEach(function (projectPage) {
				if (currentState.get('project-page-slug') == projectPage.slug) {
					page = projectPage;
				}
			});
		}
		return page;
	},
	iconDirection: function(){
		direction ={
			prev:{},
			next:{}
		};
		if (currentState.get('category-id')) {
			direction.prev.transform = 'rotate(-90deg)';
			direction.prev.name = 'order'
			direction.next.transform = 'rotate(90deg)';
			direction.next.name = 'order'
		} else if (currentState.get('year')) {
			direction.prev.transform = 'rotate(180deg)';
			direction.prev.name = 'time'
			direction.next.transform = 'rotate(0)';
			direction.next.name = 'time'
		}
		return direction;
	}
});

Template.projectPagination.helpers({
	isCurrentProjectPage: function (slug) {
		if (slug) {
			return currentState.get('project-page-slug')==slug;
		} else {
			return !currentState.get('project-page-slug');
		}
	},
	projectCoverUrl: function(){
		if (currentState.get('category-slug') && currentState.get('project-slug')) {
			params = {
				category: currentState.get('category-slug'),
				project: currentState.get('project-slug'),
			};
			return FlowRouter.path('portfolio.project', params);
		} else if (currentState.get('year') && currentState.get('project-slug')){
			params = {
				year: currentState.get('year'),
				project: currentState.get('project-slug'),
			};
			return FlowRouter.path('portfolio.date', params);
		}
	},
	projectPageUrl: function(slug){
		if (currentState.get('project-slug') && currentState.get('category-slug')) {
			params = {
				category: currentState.get('category-slug'),
				project: currentState.get('project-slug'),
				page: slug
			};
			return FlowRouter.path('portfolio.project.page', params);
		} else if (currentState.get('year') && currentState.get('project-slug')){
			params = {
				year: currentState.get('year'),
				project: currentState.get('project-slug'),
				page: slug
			};
			return FlowRouter.path('portfolio.date.page', params);
		}
	},
	button: function(){
		let slug = currentState.get('project-page-slug'),
			button={};
		if (this.pages){
			let isLastCurrentProjectPage = false;
			$.each(this.pages, (index, page)=> {
				if (this.pages.length === index + 1 && page.slug === slug){
					isLastCurrentProjectPage = true;
				} else if (page.slug === slug){
					let params = FlowRouter.current().params;
					params.page = this.pages[index+1].slug;
					button.link = FlowRouter.path(FlowRouter.current().route.name, params);
				}
			});

			if (!isLastCurrentProjectPage && slug) {
				button.text = '..\xa0more';
			} else if (!slug) {
				let params = FlowRouter.current().params;
				params.page = this.pages[0].slug;
				button.text = 'Learn more';
				button.link = FlowRouter.path(FlowRouter.current().route.name + '.page', params);
			} else {
				button.text = 'Ask questions';
				button.link = '?emailOverlay=true';
			}
		} else {
			button.text = false;
		}

		return button;
	},
});