Consent = new ReactiveDict();
navigationPath = {};
navigationMap ={};
currentState = new ReactiveDict();
searchQuery = new ReactiveVar();


Meteor.startup(function(){
	// Bootstrap breakpoints
	Template.mediaQueryBreakpoints.set({
	  xs: 0,
	  sm: 734,
	  md: 991,
	  lg: 1200
	});
});

Template.body.onRendered(function(){
	$(window).resize(function(event) {
		Template.mediaQueryBreakpoints.set({
		  xs: 0,
		  sm: 734,
		  md: 991,
		  lg: 1200
		});
	});
});

visual_code ='color';
// visual_code = ABTest.start("Visual Code", ['color', 'bw']);