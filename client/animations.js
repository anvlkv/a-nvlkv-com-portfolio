Template.landingPage.animations({
	'.svg-graphics':{
		container: '.slide',
		insert:{
			class: 'animate-in'
		},
	}
});

// Template.navMenu.animations({
// 	'.mini-nav':{
// 		insert:{
// 			class: 'animate-in'
// 		},
// 		remove:{
// 			class: 'animate-out'	
// 		},
// 		animateInitial: true,
// 	},
// });

Template.portfolio.animations({
	'.page':{
		container:'.controll_wrap',
		insert:{
			class: function(e,t){
				// console.log(navigationPath.visualDirection);
				return navigationPath.visualDirection ? navigationPath.visualDirection + ' animate-in' : 'animate-in';
			},
			delay:250,
			before: function(attrs, element, template) {
				element.removeClass('animate-in inserted');
			},
		},
		remove:{
			class: function(e, t){
				// console.log(navigationPath.visualDirection);
				return navigationPath.visualDirection ? navigationPath.visualDirection + ' animate-out' : 'animate-out';
			},
			before: function(attrs, element, template) {
				element.removeClass('animate-out removed');
			},
		},
		animateInitial: true, 
	}
});

Template.coverSlide.animations({
	'.svg-icon':{
		container: '.nav-hint',
		insert:{
			class: 'animate-in'
		},
		animateInitial: true,
		animateInitialStep: 200,
		animateInitialDelay: 300,
	},
	'.nav-plate':{
		container:'.relative-nav',
		insert:{
			class: 'animate-in'
		},
		animateInitial: true,
		animateInitialStep: 200,
	}
});

Template.categoryCoverMenu.animations({
	'.item':{
		container: '.category-level-navigation',
		insert:{
			class: 'animate-in',
		},
		animateInitial: true,
		animateInitialStep: 200,
		animateInitialDelay: 550,
	}
});

Template.categoryCoverText.animations({
	'.summary':{
		insert:{
			class: 'animate-in',
		},
		animateInitial: true,
		animateInitialDelay: 650,
	}
});


Template.galleryGrid.animations({
	'.item':{
		container: '.grid',
		insert:{
			class: 'animate-in'
		},
		animateInitial: true,
		animateInitialStep: 200,
	}
});

// Template.projectSlide.animations({
// 	'.nav-plate':{
// 		container: '.relative-nav',
// 		insert:{
// 			class: 'animate-in'
// 		},
// 		animateInitial: true,
// 		animateInitialStep: 200,
// 	}
// });

// Template.projectText.animations({
// 	'.content-plate':{
// 		insert:{
// 			class: 'animate-in'
// 		},
// 		remove:{
// 			class: 'animate-out'	
// 		},
// 		animateInitial: true,
// 	}
// });

// Template.projectCoverText.animations({
// 	'.content-plate':{
// 		insert:{
// 			class: 'animate-in'
// 		},
// 		remove:{
// 			class: 'animate-out'	
// 		},
// 		animateInitial: true,
// 	}
// });

Template.emailOverlay.animations({
	'.email-overlay':{
		insert:{
			class: 'animate-in'
		},
		remove:{
			class: 'animate-out'	
		},
		animateInitial: true,
	}
});

// Template.menuOverlay.animations({
// 	'.menu-overlay':{
// 		insert:{
// 			class: 'animate-in'
// 		},
// 		remove:{
// 			class: 'animate-out'	
// 		},
// 		animateInitial: true,
// 	}
// });


Template.mainLayout.animations({
	'.navigation-wrap':{
		insert:{
			class: 'animate-in'
		},
		remove:{
			class: 'animate-out',
			delay: 200
		},
		animateInitial: true,
	}
});

// Template.loadingState.animations({
// 	'.loading':{
// 		insert:{
// 			class: 'animate-in'
// 		},
// 		remove:{
// 			class: 'animate-out'	
// 		},
// 		animateInitial: true,
// 	}
// });