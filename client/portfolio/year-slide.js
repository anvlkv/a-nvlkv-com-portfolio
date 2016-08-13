Template.yearSlide.onCreated(function () {
	this.autorun(()=>{
		let prj = YearSubs.subscribe('ProjectsFeed');
		this.ready.set(prj.ready() && CC_Years.find().count()>0);
	})

	this.autorun(()=>{
		if (this.ready.get()) {
			Session.set('current-page-title', currentState.get('year'));
		}
	})
})

Template.yearSlide.helpers({
	years: function () {
		return CC_Years.find();
	},
	year: function () {
		return CC_Years.findOne({year: currentState.get('year')});
	},
	projects: function (){
		let prj = CC_Years.findOne({year: currentState.get('year')}).projects;
		return Projects.find({_id:{$in:prj}});
	},
	url: function(item, year){
		return FlowRouter.path('portfolio.date', {
			year: year,
			project: item
		});
	}
});