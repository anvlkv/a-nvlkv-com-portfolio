let fullpage = require('fullpage.js');

const slides = [
	{
		graphics: 'graphics_uxDesignerFront',
		title: 'Hi!',
		text: 'I\'m Aleksandr,\n user experience\n designer',
		button: {
			text:'What\'s design?',
		},
	},{
		graphics: 'graphics_userResearchSides',
		title:'It starts',
		text:'with\n acknowledging\n a problem',
		// layout: 'text-first',
		button: {
			text:'How to solve one?',
		},

	},{
		graphics: 'graphics_teamCollaborationSideFront',
		title:'The fun',
		text:'of collaboration\n with team in\n design-thinking',
		layout:'wide-image',
		delay: 1500,
		button: {
			text:'When it\'s done?',
		},
	},{
		graphics: 'graphics_iterativeImprovement',
		title:'Improvement',
		text:'gained through iterations',
		button: {
			text:'What\'s success?',
		},
	},{
		graphics: 'graphics_empoweredIndividual',
		title:'Success',
		text:'to be measured\n in individuals\n empowered\n to achieve their\n own goals',
		backgroundColor: '#0C1B2C',
		textColor:'#f7f7f7',
		button: {
			text:'Why succeed?',
		},
	},{
		graphics: 'graphics_betterWorld',
		title:'The goal',
		text:'is to contribute\n into making\n world a better\n place for\n everyone',
		backgroundColor: '#0C1B2C',
		textColor:'#f7f7f7',
		// layout:'text-first',
		delay: 1500,
		button: {
			text:'What you\'ve done?',
		},
	},{
		graphics:'graphics_goAhead',
		// layout:'single-image',
		button: {
			text:'See portfolio',
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
	this.autorun(()=>{
		
		this.ready.set(true);
		
	});
});

Template.landingPage.onRendered(function(){
	// Session.set('current-category', null);
	// Session.set('current-project', null);
	let anchors = [],
		backgrounds = [];
	$.each(slides, function(index, val) {
		// console.log(val.title);
		anchors[index]= 'slide-' + val.graphics.replace(/graphics_/g,'').toLowerCase();
		backgrounds[index]=val.backgroundColor ? val.backgroundColor : '#f7f7f7';
	});

	this.slidePaddingTop =  function (){
		let pt = $('.top-level-navigation').outerHeight();
		return pt;
	};
	

	this.autorun(()=>{
		if (this.ready.get()) {
			this.$('#fullpage').fullpage({
				slideSelector: '.fp-slide',
				sectionSelector: '.fp-section',
				anchors: anchors,
				paddingTop: this.slidePaddingTop(),
				// fixedElements: '.top-level-navigation',
				sectionsColor: backgrounds,

				afterLoad: function(anchorLink, index){
					// let loadedSection = $(this);
					activeSlide.set(index-1);

				},
			});
		}
	});


	this.autorun(()=>{
		if (activeSlide.get()>=0) {
			$.fn.fullpage.moveTo(activeSlide.get()+1);
		}
	});

	this.autorun(()=>{
		let active_sld = this.$('.fp-section.active');
		if (activeSlide.get() >= 0 && activeSlide.get() < slides.length - 1) {
			let slideTimeOut = Number.parseInt(ABTest.start("Slide timeout", ['8000', '12000', '16000', '18000']));
			// remove previous
			if (this.$('.js_slide_link svg').length > 0) {
				this.$('.js_slide_link svg').remove();
			}

			let s = Snap(active_sld.find('.js_slide_link')[0]),
				canvasSize = 20,
				progress = Snap(canvasSize, canvasSize),
				centre = canvasSize/2,
				radius = canvasSize*0.8/2,
				path = '',
				arc = progress.path(path),
				startY = centre - radius,
				color = active_sld.find('.js_slide_link').css('color'),
				slide = active_sld.find('.slide'),
				startSLide = activeSlide.get();

			progress.appendTo(s);


			// this.$('.js_slide_link').mouseenter(function() {
				
			// });

			// console.log(s);

			if (slides[activeSlide.get()].delay) {
				slideTimeOut += slides[activeSlide.get()].delay;
			}
	

			// console.log(slide);

			// console.log(slideTimeOut);

			let prog_bar = Snap.animate(0, 359.99999, function(val){
				
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
					// slide.addClass('animate-out');
					// Meteor.setTimeout(function () {
						
						// console.log(slide.find('.js_slide_link'));

						slide.find('.js_slide_link svg').remove();
						slide.find('.js_slide_link').click();

					// }, 250);
				}
			});

			s.hover(function() {
				prog_bar.stop();
				slide.find('.js_slide_link svg').remove();
			});

			s.click(function() {
				prog_bar.stop();
				// slide.addClass('animate-out');
				slide.find('.js_slide_link svg').remove();
			});

			slide.find('.js_slide').click(function() {
				prog_bar.stop();
				// slide.addClass('animate-out');
				slide.find('.js_slide_link svg').remove();
			});

			Deps.autorun(function(){
				if (activeSlide.get()!=startSLide) {
					prog_bar.stop();
					slide.find('.js_slide_link svg').remove();
				}
			});


		} else {
			// this.$('.slide').removeClass('animate-out');
			
			// remove previous
			if (active_sld.find('.js_slide_link svg').length > 0) {
				active_sld.find('.js_slide_link svg').remove();
			}

			GAnalytics.event('landing', 'seen-last-slide');
		}
	});
});

Template.landingPage.onDestroyed(function(){
	$.fn.fullpage.destroy('all');
});

// let activeSlide = new ReactiveVar(0);

Template.landingPage.helpers({
	slides: function () {
		return slides;
	},
	currentSlide: function(slide){
		const t = Template.instance();

		// if (FlowRouter.getQueryParam('sld')) {
		// 	activeSlide.set(FlowRouter.getQueryParam('sld'));
		// }
		
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
		ABTest.finish("Slide timeout");
		activeSlide.set($(e.currentTarget).data('slide'));
	},
	'click .js_slide_link': function (e, t){
		ABTest.finish("Slide timeout");
		GAnalytics.event('landing', 'slide-link');
		if (!slides[activeSlide.get()].button.link) {
			
			activeSlide.set(activeSlide.get()+1);

		} else {
			
			FlowRouter.go(slides[activeSlide.get()].button.link);

		}

		return e;
	},
});