let hasPages = function(){
	let prj = Projects.findOne({_id:Session.get('current-project')});
	return prj && prj.pages;
}

const hints = [
	{
		name:'swipeVertical',
		text:'Swipe up or down to explore projects by order',
		devices: ['phone', 'tablet'],
		routes: ['portfolio.project']
	},{
		name:'swipeHorizontal',
		text:'Swipe left or right to navigate projects timeline',
		devices: ['phone', 'tablet'],
		routes: ['portfolio.project','portfolio.category']
	},{
		name: 'doubleTap',
		text: 'Tap twice to learn more',
		devices: ['phone', 'tablet'],
		routes: ['portfolio.project'],
		requirement: hasPages,
	},{
		name:'keysHorizontal',
		text:'Use left or right arrow keys to navigate projects timeline',
		devices: ['desktop', 'tv'],
		routes: ['portfolio.project','portfolio.category']
	},{
		name:'keysVertical',
		text:'Use up or down arrow keys to explore projects by order',
		devices: ['desktop', 'tv'],
		routes: ['portfolio.project']
	},{
		name:'keyEnter',
		text:'Hit enter to learn more',
		devices: ['desktop', 'tv'],
		routes: ['portfolio.project'],
		requirement: hasPages,
	}
];

experiencePath = new ReactiveDict();
expectedExperience = new ReactiveVar();
// requestedHint = new ReactiveVar();


startExperienceController = function(){
	if (Consent.get('cookies') && Cookie.get('a_nvlkv_consent')) {
		if(Cookie.get('a_nvlkv_exp')){
			let previous =  Cookie.get('a_nvlkv_exp').split(' ');
			$.each(previous, function(index, val) {
				experiencePath.set(val, true);
			});
		}
	}
};

addToExperiencePath = function(name){
	if (!experiencePath.get(name)) {
		experiencePath.set(name, true);
		if (Consent.get('cookies')) {
			if (Cookie.get('a_nvlkv_exp')) {
				Cookie.set('a_nvlkv_exp', Cookie.get('a_nvlkv_exp') + ' ' + name);	
			}else{
				Cookie.set('a_nvlkv_exp', name);
			}
			
		}
	}
	
	if (expectedExperience.get() == name) {
		ABTest.finish("Hint timing");
	}
};

hideHint = function(){
	if (Session.get('active-overlay') === 'hint') {
		Session.set('active-overlay', false);
		GAnalytics.event(FlowRouter.current().path, 'hint-hidden');
	}
	// $('.hint-overlay').hide();
};

showHint = function(){
	if (!Session.get('active-overlay')) {
		Session.set('active-overlay', 'hint');
	}
};





Template.hintOverlay.helpers({
	hint: function () {
		let current = experiencePath.keys,
			hint;


		$.each(hints, function(index, val) {
			if (val.name in current) {
				// skip
			}else{
				$.each(val.devices, function(index, device) {
					$.each(val.routes, function(index, route) {
						if (FlowRouter.current().route.name == route) {
							if (device == Meteor.Device._type) {
								if (val.requirement && val.requirement()) {
									hint = val;
								} else if (!val.requirement){
									hint = val;
								}


								if (hint) {
									expectedExperience.set(val.name);
									GAnalytics.event(FlowRouter.current().path, 'hint-shown', hint.name);
								}
							}
						}
					});
				});
			}
		});

		return hint;
	},
});


Template.hintOverlay.events({
	'click .js_close_hint': function () {
		hideHint();
	}
});