Template.dropdown.onCreated(function(){
	this.itemHeight = 0;
	this.contentWidth = 0;
});

Template.dropdown.onRendered(function(){
	this.setSize = ()=>{
		if (this.$('.dropdown').hasClass('dropdown-ready')) {
			this.$('.dropdown').removeClass('dropdown-ready');
			this.$('.dropdown_item').attr('style', '');
			this.$('.dropdown').attr('style', '');
		}

		if (this.$('.dropdown').closest('.mobile_dropdown').length > 0) {
			this.contentWidth = this.$('.dropdown').closest('.mobile_dropdown').width();
		}else{
			$.each(this.$('.dropdown_item'), (index, item) => {
				if (this.contentWidth < $(item).outerWidth() || this.contentWidth < $(item).width()) {
					this.contentWidth = $(item).outerWidth() > $(item).width() ? $(item).outerWidth() : $(item).width();
				}
				// console.log(this.contentWidth);
			});
		}

		this.$('>.dropdown').addClass('dropdown-ready');


		if (this.itemHeight < this.$('.dropdown').outerHeight() || this.itemHeight < this.$('.dropdown').height()) {
			this.itemHeight = this.$('.dropdown').outerHeight() > this.$('.dropdown').height() ? this.$('.dropdown').outerHeight() : this.$('.dropdown').height();
		}

		if (this.itemHeight === 0) {
			this.itemHeight = 81;
		}


		// console.log(this.$('.dropdown_item').not('.mobile-dropdown-content'));
		this.$('.dropdown_item').not('.mobile-dropdown-content').css({
			height: this.itemHeight,
		});
		
		this.$('.dropdown').css({
			width: this.contentWidth,
		});

	}

	this.collapsDropdown = ()=>{
		this.$('.dropdown_content').addClass('collapsed');
		Meteor.setTimeout(()=>{
			if (this) {
				this.setSize();
			}
		}, 25);
		this.$('.dropdown').trigger('dropdownclosed');
	}

	this.openDropdown = ()=>{
		this.$('.dropdown_content').removeClass('collapsed');
		this.$('.dropdown').trigger('dropdownopen');
	}

	this.autorun(()=>{
		this.setSize();

		this.$('.dropdown').on('itemchanged', (e)=>{
			e.stopPropagation();
			this.setSize();
			return false;
		});

		this.$('.dropdown').on('dropdownclosed', (e)=>{
			// e.stopPropagation();
			if (!this.$('.dropdown_content').hasClass('collapsed')) {
				this.collapsDropdown();
			}
			
		});
	});

});

Template.dropdownItem.onRendered(function(){
	this.autorun(()=>{
		this.$('.dropdown_item').trigger('itemchanged');
	})
});

Template.mobileDropdownMenu.onRendered(function(){
});


Template.dropdown.events({
	'mouseenter .dropdown_trigger': function (e,t) {
		if (Meteor.Device.isDesktop()) {
			Template.instance().openDropdown();
		}
	},
	'mouseleave .dropdown': function(e,t){

		Template.instance().collapsDropdown();

	},
	'click .dropdown_trigger': function(e,t){

		if (t.$('.dropdown_content').hasClass('collapsed')) {
			

			Template.instance().openDropdown();

		} else {
			

			Template.instance().collapsDropdown();

			if ($(e.target).attr('href')) {
				FlowRouter.go($(e.target).attr('href'));
			}
			// console.log(e);
			return e;
		}
		return false;
	},
	'click .dropdown_item:not(.dropdown_trigger)':  function(e, t){
		Template.instance().collapsDropdown();
	}
});
