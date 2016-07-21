Template.background.onRendered(function(){
	this.autorun(()=>{
		let tmpl=Template.instance();	

		if (Template.currentData()) {
			// console.log(Template.currentData());
			let background_id;
			$.each(Template.currentData(), function(index, val) {
				 if (val.targetSize == Session.get('screensize')) {
				 	background_id = val.file;
				 }
			});

			if (!background_id) {
				$.each(Template.currentData(), function(index, val) {
					if (val.targetSize=='any') {
						background_id = val.file;
					}
				});
			}

			// console.log(background_id);

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

