Template.background.onRendered(function(){
	var self = this;
	self.autorun(function(){
		let tmpl=Template.instance();	
		// tmpl.$('.background').removeClass('fade-in').addClass('fade-out');
		// console.log(tmpl);
		if (Template.currentData()) {
			let background_id = Template.currentData();
			// console.log(background_id);
			// console.log(tmpl.$('.background').css('background-image', 'url(/cfs/files/images/' + background_id));
			// tmpl.$('.background').removeClass('fade-out').addClass('fade-in');
			tmpl.$('.background').removeClass('animate-in').addClass('animate-out');
			tmpl.$('.background').attr('style', 'background-image: url(/cfs/files/images/' + background_id + ');');
			tmpl.$('.background').imagesLoaded( { background: true }, function() {
				tmpl.$('.background').removeClass('animate-out').addClass('animate-in');
			});

		} else {
			tmpl.$('.background').removeAttr('style');
		}
	});
});