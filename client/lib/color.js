visual_code ='';
visual_code = ABTest.start("Visual Code", ['color', 'bw']);

dynamicColor=(self)=>{
	self.$('.dynamic_color').each(function(index, el) {
		if (visual_code === 'bw') {
			$(el).css('background', '#f7f7f7');
			return;
		}

		const current_category = Session.get('current-category');

		if ($(el).data('color')) {
			$(el).css('background', $(el).data('color'));
		} else if(current_category) {
			let category = Categories.findOne(current_category);
			if (category) {
				$(el).css('background', category.color);
			}
		} else {
			$(el).css('background', '');
		}
		
	});
};

// Template.registerHelper('globalPallet',()=>{
// 	return {
// 		utility: '#9067f7',
// 		cta: '#67a8f7',
// 		history: '#d555ac',
// 		interactive:'#c4e059',
// 	};
// });

Template.onRendered(function(){
	dynamicColor(this);
	Tracker.autorun(function () {
		dynamicColor(this);
	});
});