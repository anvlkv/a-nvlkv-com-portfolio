// function fitHeight (jqel) {
// 	jqel.css('max-height', $(jqel.parents()[0]).height()+'px');

// }

// Template.graphicsContainer.onRendered(function (){
// 	// let fitable = this.$('.js_fit_height');
// 	// fitHeight(fitable);
// 	// $(window).resize(function(event) {
// 	// 	fitHeight(fitable);
// 	// });

// 	console.log(this);
// });

const tu = 250,
	timeouts = [],
	intervals = [];


// clean timers on destroyed
clear_timers = function(){
	$.each(timeouts, function(index, val) {
		 Meteor.clearTimeout(val);
	});
	$.each(intervals, function(index, val) {
		 Meteor.clearInterval(val);
	});
};

Template.graphics_uxDesignerFront.onDestroyed(function(){
	clear_timers();
});
Template.graphics_userResearchSides.onDestroyed(function(){
	clear_timers();
});
Template.graphics_teamCollaborationSideFront.onDestroyed(function(){
	clear_timers();
});
Template.graphics_empoweredIndividual.onDestroyed(function(){
	clear_timers();
});
Template.graphics_betterWorld.onDestroyed(function(){
	clear_timers();
});
Template.graphics_goAhead.onDestroyed(function(){
	clear_timers();
});




Template.graphics_uxDesignerFront.onRendered(function(){
	const s = Snap(this.$('#uxDesignerFront')[0]);
	// s.animate({ transform: 'r360,150,150' }, 1000, mina.bounce);

	const face = Snap(this.$('#ux-designer-features')[0]);

	const transform = face.attr('transform').string;

	// console.log(transform);

	intervals.push(Meteor.setInterval(function(){
		s.animate({transform: 't0, 15'}, tu*4, mina.easeinout, function(){
			s.animate({transform: 't0, 0'}, tu*4, mina.easeinout);
		});

		face.animate({transform: transform+', r5'}, tu*4, mina.easeinout, function(){
			face.animate({transform: transform+', r-5'}, tu*4, mina.easeinout);
		});


	}, tu*8));
});

Template.graphics_userResearchSides.onRendered(function(){
	// console.log(this.$('#ux-designer-features'));

	const questions = [],
		responses = [],
		interviewer = Snap(this.$('#ux-designer-features')[0]),
		respondent = Snap(this.$('#individual-features')[0]);


	
	let transform = {
		interviewer: interviewer.attr('transform').string,
		respondent: respondent.attr('transform').string,
	};

	this.$('#questions tspan').each(function(index, el) {
		
		questions.push(Snap(el));
	});

	this.$('#responses tspan').each(function(index, el) {
		responses.push(Snap(el));
	});

	$.each(questions, function(index, el) {
		// console.log(el);
		intervals.push(Meteor.setInterval(function(){
			el.animate({x: 53}, tu*2, mina.easeout, function(){
				el.animate({x: 43},tu*2, mina.easein);
			});
		},tu*4*(index+1)));
	});

	$.each(responses, function(index, el) {
		// console.log(el);
		intervals.push(Meteor.setInterval(function(){
			el.animate({x: 16}, tu*2, mina.easeout, function(){
				el.animate({x: 26},tu*2, mina.easein);
			});
		},tu*4*(index+1)));
	});

	intervals.push(Meteor.setInterval(function(){
		interviewer.animate({transform: transform.interviewer + ', r5'}, tu*2, mina.easeinout, function(){
			interviewer.animate({transform: transform.interviewer + ', r0'}, tu*2, mina.easeinout);
		});

		respondent.animate({transform: transform.respondent + ', r0'}, tu*2, mina.easeinout, function(){
			respondent.animate({transform: transform.respondent + ', r5'}, tu*2, mina.easeinout);
		});
	}, tu*4));
	
});

Template.graphics_teamCollaborationSideFront.onRendered(function(){

	let team = ['artist', 'salesman', 'programmer', 'designer'];

	let seq = [[0,3], [1,2], [0,1], [2,3]];

	set_face = function(face, name){
		// console.log(face, name);
		face.animate({
			opacity: 0},
			tu, mina.easein, function() {
				let features;
				if (face.attr('xlink:href').indexOf('side')>=0) {
					features = name + '-features-side';
				} else {
					features = name + '-features-front';
				}
				face.attr('xlink:href', '#'+features);
				face.attr('data-name', name);
				face.animate({opacity:1}, tu, mina.easeout);
		});

	};

	get_face = function(name) {
		return Snap(this.$('#'+name+'-features use')[0]);
	};

	get_c_name = function(name){
		return get_face(name).attr('data-name');
	};

	swap_faces = function(name1, name2) {
		set_face(get_face(name1), get_c_name(name2));
		set_face(get_face(name2), get_c_name(name1));
	};


	swap_faces('salesman', 'programmer');

	intervals.push(Meteor.setInterval(function(){
		$.each(seq, function(index, val) {
			timeouts.push(Meteor.setTimeout(function(){
				swap_faces(team[val[0]], team[val[1]]);
			}, tu*4*index));
		});
	}, tu*4*seq.length+80));
});

Template.graphics_iterativeImprovement.onRendered(function(){
	let iterative_process = Snap('#iterative_process path'),
		iteration_state = Snap('#iteration_state'),
		len = iterative_process.getTotalLength();

	// console.log(iterative_process,iteration_state,len);

	Snap.animate(0, len, function(value){
		movePoint = iterative_process.getPointAtLength( value );
		iteration_state.attr({ cx: movePoint.x, cy: movePoint.y });
	}, tu*20, mina.easeinout, function(){
		iteration_state2 = iteration_state.clone();
		// iteration_state.remove();
		Snap.animate(0, len, function(value){
			movePoint = iterative_process.getPointAtLength( value );
			iteration_state2.attr({ cx: movePoint.x, cy: movePoint.y });
		}, tu*20, mina.easeinout, function(){
			iteration_state2.remove();
		});
		Meteor.setInterval(()=>{
			iteration_state3 = iteration_state.clone();
			Snap.animate(0, len, function(value){
				movePoint = iterative_process.getPointAtLength( value );
				iteration_state3.attr({ cx: movePoint.x, cy: movePoint.y });
			}, tu*20, mina.easeinout, function(){
				iteration_state3.remove();
			});
		}, tu*20+150);
	});


});

Template.graphics_empoweredIndividual.onRendered(function(){
	// console.log(this.$('#constellation ellipse'));
	this.$('#constellation ellipse').each(function(index, el) {
		el = Snap(el);
		intervals.push(Meteor.setInterval(function(){
			el.animate({
			opacity: 0.05},
			tu*2, mina.easein, function() {
				el.animate({opacity:1}, tu*2, mina.easeout);
		});
		}, (index+4)*tu));
	});
});

Template.graphics_betterWorld.onRendered(function(){
	blink_1up = function(){
		let el = Snap(this.$('#1up')[0]);
		el.animate({opacity: 1, transform:'t0, 10'}, tu, mina.easein, function(){
			el.animate({opacity:0, transform: 't0, 0'}, tu, mina.easeout);
		});
	};

	let uses=this.$('#Ring use');
	let ssp =Snap(this.$('#start-shaped-person path#shape')[0]),
		bwe =Snap(this.$('#betterWorldExit')[0]),
		fwf =Snap(this.$('#Flower-features')[0]),
		glb =Snap(this.$('#Globe')[0]),
		rng =Snap(this.$('#Ring')[0]);

	uses.each(function(index, el) {
		el = Snap(el);
		timeouts.push(Meteor.setTimeout(function(){
			el.animate({opacity:1}, tu*2, mina.easein, function(){
				// blink_1up();

				// further animations
				if (index == uses.length - 1) {
					ssp.animate({path:'M120.57962,88.8414617 L96.9052383,136.804069 L0.392350131,150.826187 L70.2297321,218.890976 L53.7433626,315 L140.067114,269.623474 L226.390865,315 L209.904496,218.890976 L279.741878,150.826187 L183.22899,136.804069 L159.554608,88.8414617 C175.535128,81.4674171 186.625369,65.3044181 186.625369,46.5515289 C186.625369,20.8418294 165.780528,7.10542736e-15 140.067114,7.10542736e-15 C114.3537,7.10542736e-15 93.5088594,20.8418294 93.5088594,46.5515289 C93.5088594,65.3044181 104.5991,81.4674171 120.57962,88.8414617 Z',
							transform: 'translate(140.067114, 157.500000) scale(1, -1) rotate(-360.000000) translate(-140.067114, -157.500000)'
						},tu*4, mina.easeout, function(){
						bwe.animate({opacity:1}, tu*2, mina.easeout);
						rng.animate({opacity:0}, tu*2, mina.easeout, function(){
							fwf.animate({opacity:1}, tu, mina.easein);
						});
					});
					glb.animate({opacity: 0}, tu, mina.easein);
				}
			});	
		}, tu*2*(index+1)));
	});

});

Template.graphics_goAhead.onRendered(function(){
	let arrow = Snap(this.$('#rotation_body')[0]);

	let btn = Snap(this.$('#replay_button')[0]);

	rotate_i = function(time, r){
		let transform = arrow.attr('transform').string;
		if (!time) {
			time = 16;
		}

		if (!r) {
			r = 'r-365';
		}

		if (transform) {
			arrow.animate({transform: transform + ', ' + r}, tu*time, mina.linear, function(){
				rotate_i(time, r);
			});
		}else{
			arrow.animate({transform: r}, tu*time, mina.linear, function(){
				rotate_i(time, r);
			});
		}
	};

	rotate_i();

	btn.hover(function() {
		arrow.stop();
		rotate_i(2);
	}, function() {
		arrow.stop();
		rotate_i();
	});

});

Template.graphics_goAhead.events({
	'click #replay_button': function (e, t) {
		// FlowRouter.setQueryParams({sld:0});
		Session.set('replay-slides', true);
	}
});


