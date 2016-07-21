Meteor.startup(function(){
	// Bootstrap breakpoints
	Template.mediaQueryBreakpoints.set({
	  xs: 0,
	  sm: 735,
	  md: 992,
	  lg: 1200
	});
});