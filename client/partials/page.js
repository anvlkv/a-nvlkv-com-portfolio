Template.page.onRendered(function(){
	this.navHeight = ()=>{
		return $('.main-layout > .navigation-wrap:not(.menu-open)').outerHeight()
	};
	this.viewHeight = ()=>{
		return $(window).height() - this.navHeight();
	};
	this.setHeight = ()=>{

		this.$('.page').css({
			'margin-top': this.navHeight() + 'px',
			'height': this.viewHeight() + 'px'
		});
	};
	this.autorun(()=>{
		this.setHeight();
		let initial = this.viewHeight();
		this.interval = Meteor.setInterval(()=>{
			if (initial !== this.viewHeight()) {
				this.setHeight();
			}
		},250)
	});

	$(window).resize((event)=> {
		this.setHeight();
	});
});

Template.page.onDestroyed(function(){
	$(window).off('resize');
	Meteor.clearInterval(this.interval);
});