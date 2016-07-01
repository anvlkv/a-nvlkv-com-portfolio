dynamicColor=(self)=>{
	self.$('.dynamic_color').each(function(index, el) {
		const current_category = Session.get('current-category');
		if ($(el).data('color')) {
			$(el).css('background-color', $(el).data('color'));
		} else if(current_category) {
			let category = Categories.findOne(current_category);
			if (category) {
				$(el).css('background-color', category.color);
			}
		} else {
			// console.log('no color');
		}
		
	});
};

Template.registerHelper('globalPallet',()=>{
	return {
		utility: '#B367F7',
		cta: '#677CF7',
		history: '#d555ac',
		interactive:'#c4e059',
	};
});

Template.onRendered(function(){
	dynamicColor(this);
	Tracker.autorun(function () {
		dynamicColor(this);
	});
});