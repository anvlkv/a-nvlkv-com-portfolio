Template.CRUDpanel.helpers({
	isDisabled : function (id){
		// console.log(id);
		return id ? {} : {disabled: 'disabled'}
	}
});