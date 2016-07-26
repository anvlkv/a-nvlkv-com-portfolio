Template.CRUDpanel.helpers({
	beforeRemove: function () {
      return function (collection, id) {
        var doc = collection.findOne(id);
        bootbox.confirm('Really delete "' + (doc.title ? doc.title : doc._id) + '"?',(result)=>{
			// console.log(result);
			this.remove();
        });
      };
    }
});

Template.CRUDpanel.events({
	'click .js_save': (event, template) => {
		Session.set('saveIntent', 'save');
	},
	'click .js_save_add': (event, template) => {
		Session.set('saveIntent', 'save_add');
	},
	'click .js_save_edit': (event, template) => {
		Session.set('saveIntent', 'save_edit');
	}
});



