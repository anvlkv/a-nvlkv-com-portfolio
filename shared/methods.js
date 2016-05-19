Meteor.methods({
	addCategory: function (category) {
		return Categories.insert(category, function(error, result){
			if (error) {
				console.log(error);
				return
			} else {
				// console.log(result);
				return result
			}
		});
	},
	updateCategory: function (category, catObjId){
		return Categories.update({_id:catObjId}, {$set:category}, function(error, result){
			if (error) {
				console.log(error);
				return
			} else {
				// console.log(result);
				return catObjId
			}
		});
	},
	removeCategory: function (catObjId){
		Categories.remove({_id:catObjId}, function(error){
			if (error) {
				console.log(error);
				return
			}
		});
		Projects.update({'category':catObjId}, {$set:{'category':undefined}}, function(error, result){
			if (error) {
				console.log(error);
				return
			} else {
				console.log(result);
				return
			}
		});
		Projects.update({'secondaryCategory':catObjId}, {$pull:{'secondaryCategory':catObjId}}, function(error, result){
			if (error) {
				console.log(error);
				return
			} else {
				console.log(result);
				return
			}
		});

		return catObjId
	},
	addProject: function (project) {
		return Projects.insert(project, function(error, result){
			if (error) {
				console.log(error);
				return
			} else {
				// console.log(result);
				return result
			}
		});
	},
	updateProject: function (project, prjObjId){
		return Projects.update({_id:prjObjId}, {$set:project}, function(error, result){
			if (error) {
				console.log(error);
				return
			} else {
				// console.log(result);
				return prjObjId
			}
		});
	},
	removeProject: function (prjObjId){
		return Projects.remove({_id:prjObjId}, function(error){
			if (error) {
				console.log(error);
				return
			} else {
				return prjObjId
			}
		});
	}

});