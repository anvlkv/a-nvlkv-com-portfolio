const slides = [
	{
		graphics: 'graphics_uxDesignerFront',
		title: 'Hi!',
		text: 'I\'m Aleksandr,\n user experience\n designer',
	},{
		graphics: 'graphics_userResearchSides',
		title:'It starts',
		text:'with\n acknowledging\n a problem',
		layout: 'text-first',
	},{
		graphics: 'graphics_teamCollaborationSideFront',
		title:'The FUN',
		text:'of collaboration\n with team in\n design-thinking',
		layout:'wide-image',
	},{
		graphics: 'graphics_empoweredIndividual',
		title:'Success',
		text:'to be measured\n in individuals\n empowered\n to achieve their\n own goals',
		backgroundColor: '#0C1B2C',
		textColor:'#ffffff',
	},{
		graphics: 'graphics_betterWorld',
		title:'The goal',
		text:'is to contribute\n into making\n world a better\n place for\n everyone',
		backgroundColor: '#0C1B2C',
		textColor:'#ffffff',
		layout:'text-first',
	},{
		graphics:'graphics_goAhead',
		layout:'wide-image'
	}
];

Template.landingPage.onCreated(function(){
	this.activeSlide = new ReactiveVar(0);
});

// let activeSlide = new ReactiveVar(0);

Template.landingPage.helpers({
	slides: function () {
		return slides;
	},
	currentSlide: function(slide){
		const t = Template.instance();
		if (!t.activeSlide.get()) {
			t.activeSlide.set(0);
		}
		if (!slide) {
			return slides[t.activeSlide.get()];
		} else {
			let keys = [],
				obj = slides[t.activeSlide.get()],
				objKeys = Object.keys(obj);
			for (let j = 0; j < objKeys.length; j++) {
				let key = objKeys[j];
				if (slide[key] == obj[key]){
					keys.push(true);
				} else {
					keys.push(false);
				}
			}
			if (keys.every(elem => elem === true)){
				return true;
			}
		}
	},
});

Template.landingPage.events({
	'click .js_slide': function (e,t) {
		t.activeSlide.set($(e.currentTarget).data('slide'));
	}
});