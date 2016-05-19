Template.optionsList.helpers({
	isSelected: function (id, val) {
		if (Array.isArray(val)) {
			var found = $.inArray(id, val);
			return found >= 0 ? {selected:'selected'} : {}
		} else {
			return id == val ?	{selected:'selected'} : {}
		}
	}
});