Template.coverPage.helpers({
	cover: function () {
		const cover = Covers.findOne({isActive:true}, {sort:{dateOfIssue:-1}});
		if (Session.get('current-project')||Session.get('current-category')) {
			Session.set('current-category', undefined);
			Session.set('current-project', undefined);
		}
		
		return cover
	}
});