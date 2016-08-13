Template.background.onRendered(function(){
	this.autorun(()=>{
		let tmpl=Template.instance();	

		if (Template.currentData()) {
			// console.log(Template.currentData());
			let background_id;
			$.each(Template.currentData(), function(index, val) {
				// console.log(Template.currentData()[index], Session.get('screensize'))
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

Template.picture.helpers({
	src: function(size){
		let src;
		$.each(this.set, function(index, val) {
			if (size && val.targetSize == size) {
				src = '/cfs/files/images/' + val.file;
			} else if (!size && val.targetSize == Session.get('screensize')){
				src = '/cfs/files/images/' + val.file;
			}
		});

		if (!src) {
			$.each(this.set, function(index, val) {
				if (val.targetSize=='any') {
					src = '/cfs/files/images/' + val.file;
				}
			});
		}

		return src;
	},
});

// Template.pattern.onRendered(function(){
// 	let pattern = Snap(this.$('#template-pattern')[0]);

// 	pattern.text(0, 0).attr({
// 		'text': this.data.text,
// 		'color': this.data.color
// 	});
// });






