Template.date.helpers({
	dateMY: function (date) {
		return moment(date).format('MMM YYYY');
	},
	dateY: function (date) {
		return moment(date).format('YYYY');
	},
	sameDateMY: function (date1, date2) {
		if (moment(date1).format('MMM YYYY') === moment(date2).format('MMM YYYY')) {
			return true;
		} else if (!date2 && date1){
			return true;
		}
		
	},

});