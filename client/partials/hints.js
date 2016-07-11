const hints = [
	{
		icon:'swipeVertical',
		text:'Swipe up or down to navigate projects timeline'
	},{
		icon:'swipeHorizontal',
		text:'Swipe left or right to explore projects by order'
	},{
		icon:'keysHorizontal',
		text:'Use left or right arrow keys to explore projects by order'
	},{
		icon:'keysVertical',
		text:'Use up or down arrow keys to navigate projects timeline'
	},{
		icon:'keyEnter',
		text:'Hit enter for project details or next page',
	}
];

Template.hintOverlay.helpers({
	hint: function () {
		obj={
			icon:'swipeLeft',
			text:'swipe to navigate'
		};
		return obj;
	}
});

Template.hintOverlay.events({
	'click .js_close_hint': function () {
		Session.set('active-overlay', false);
	}
});