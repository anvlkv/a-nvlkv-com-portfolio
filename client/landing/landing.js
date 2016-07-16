const slides = [
	{
		graphics: 'graphics_uxDesignerFront',
		title: 'Hi!',
		text: 'I\'m Aleksandr,\n user experience\n designer',
		button: {
			text:'What\'s UX?',
		},
	},{
		graphics: 'graphics_userResearchSides',
		title:'It starts',
		text:'with\n acknowledging\n a problem',
		layout: 'text-first',
		button: {
			text:'Where\'s the fun?',
		},

	},{
		graphics: 'graphics_teamCollaborationSideFront',
		title:'The FUN',
		text:'of collaboration\n with team in\n design-thinking',
		layout:'wide-image',
		button: {
			text:'How to succeed?',
		},
	},{
		graphics: 'graphics_empoweredIndividual',
		title:'Success',
		text:'to be measured\n in individuals\n empowered\n to achieve their\n own goals',
		backgroundColor: '#0C1B2C',
		textColor:'#ffffff',
		button: {
			text:'Why succeed?',
		},
	},{
		graphics: 'graphics_betterWorld',
		title:'The goal',
		text:'is to contribute\n into making\n world a better\n place for\n everyone',
		backgroundColor: '#0C1B2C',
		textColor:'#ffffff',
		layout:'text-first',
		button: {
			text:'Yay!',
		},
	},{
		graphics:'graphics_goAhead',
		layout:'single-image',
		button: {
			text:'See my portfolio',
			link:'/portfolio'
		},
	}
];

Template.landingPage.onCreated(function(){
	this.activeSlide = new ReactiveVar(0);
	this.autorun(()=>{
		if (Session.get('replay-slides')) {
			this.activeSlide.set(0);
			Session.set('replay-slides', false);
		}
	});
});

Template.landingPage.onRendered(function(){
	Session.set('current-category', null);
	Session.set('current-project', null);
	Tracker.autorun(()=>{
		if (this.activeSlide.get() >= 0) {

			// console.log(this.$('[data-slide='+this.activeSlide.get()+'] use'));
		}


	});
});

// let activeSlide = new ReactiveVar(0);

Template.landingPage.helpers({
	slides: function () {
		return slides;
	},
	currentSlide: function(slide){
		const t = Template.instance();

		if (FlowRouter.getQueryParam('sld')) {
			t.activeSlide.set(FlowRouter.getQueryParam('sld'));
		}
		
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
	}
});

Template.landingPage.events({
	'click .js_slide': function (e,t) {
		t.activeSlide.set($(e.currentTarget).data('slide'));
	},
	'click .js_slide_link': function (e, t){
		if (!slides[t.activeSlide.get()].button.link) {
			t.activeSlide.set(t.activeSlide.get()+1);
		} else {
			return e;
		}
	},
});