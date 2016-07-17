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
			text:'What\'s next?',
		},

	},{
		graphics: 'graphics_teamCollaborationSideFront',
		title:'The FUN',
		text:'of collaboration\n with team in\n design-thinking',
		layout:'wide-image',
		button: {
			text:'What\'s success?',
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
		delay: 1500,
		button: {
			text:'Good to know!',
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

let activeSlide = new ReactiveVar(0);

Template.landingPage.onCreated(function(){
	this.autorun(()=>{
		if (Session.get('replay-slides')) {
			activeSlide.set(0);
			Session.set('replay-slides', false);
		}
	});
});

Template.landingPage.onRendered(function(){
	// Session.set('current-category', null);
	// Session.set('current-project', null);
	this.autorun(()=>{
		if (activeSlide.get() >= 0 && activeSlide.get() < slides.length - 1) {
			let slideTimeOut = Number.parseInt(ABTest.start("Slide timeout", ['6000', '8000', '10000']));

			let s = Snap(this.$('.js_slide_link')[0]),
				canvasSize = 20,
				progress = Snap(canvasSize, canvasSize),
				centre = canvasSize/2,
				radius = canvasSize*0.8/2,
				path = '',
				arc = progress.path(path),
				startY = centre - radius,
				color = this.$('.js_slide_link').css('color'),
				slide = this.$('.slide').removeClass('animate-out'),
				startSLide = activeSlide.get();

			progress.appendTo(s);

			s.click(function(event) {
				
				slide.find('.js_slide_link svg').remove();

			});

			// this.$('.js_slide_link').mouseenter(function() {
				
			// });

			if (slides[activeSlide.get()].delay) {
				slideTimeOut += slides[activeSlide.get()].delay;
			}

			let prog_bar = Snap.animate(0, 359.9, function(val){
				
				arc.remove();

				let d = val,
					dr = d - 90,
					radians = (Math.PI*dr)/180,
					endx = centre + radius * Math.cos(radians),
					endy = centre + radius * Math.sin(radians),
					largeArc = d>180 ? 1 : 0;

					path = "M"+centre+","+startY+" A"+radius+","+radius+" 0 "+largeArc+",1 "+endx+","+endy;

					// console.log(val);

					arc = progress.path(path);


					arc.attr({
						stroke: color,
						fill: 'none',
						strokeWidth: 3
					});

			},slideTimeOut, mina.easeinout, function () {
				if (startSLide === activeSlide.get()) {		
					slide.addClass('animate-out');
					Meteor.setTimeout(function () {
						
						slide.find('.js_slide_link svg').remove();
						slide.find('.js_slide_link').click();

					}, 250);
				}
			});

			s.hover(function() {
				// console.log('hovering');
				prog_bar.stop();
				slide.find('.js_slide_link svg').remove();
			});


		} else {
			this.$('.slide').removeClass('animate-out');
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
			activeSlide.set(FlowRouter.getQueryParam('sld'));
		}
		
		if (!activeSlide.get()) {
			activeSlide.set(0);
		}
		if (!slide) {
			return slides[activeSlide.get()];
		} else {
			let keys = [],
				obj = slides[activeSlide.get()],
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
		activeSlide.set($(e.currentTarget).data('slide'));
	},
	'click .js_slide_link': function (e, t){
		ABTest.start("Slide timeout");
		GAnalytics.event('landing', 'slide-link');
		if (!slides[activeSlide.get()].button.link) {
			
			activeSlide.set(activeSlide.get()+1);

		} else {
			
			FlowRouter.go(slides[activeSlide.get()].button.link);

		}

		return e;
	},
});