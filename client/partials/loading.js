Template.loadingState.onCreated(function(){
	this.startDate = new ReactiveVar();
});

Template.loadingState.onRendered(function() {
	this.startDate = new Date();
	GAnalytics.event('loading', 'rendered', FlowRouter.current().path);
});

Template.loadingState.onDestroyed(function() {
	GAnalytics.timing('loading-time', 'loading-exits', new Date() - this.startDate, FlowRouter.current().path);
});