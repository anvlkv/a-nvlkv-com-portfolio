Meteor.publish('Categories', function() {
	return Categories.find({},{
		sort:{
			order:1
		}
	});
});

Meteor.publish('Projects', function() {
	return Projects.find();
});

Meteor.publish('Attachements', function() {
	return Attachements.find();
});

Meteor.publish('Images', function() {
	return Images.find();
});

Meteor.publish('Files', function() {
	return Files.find();
});

Meteor.publish('Covers', function() {
	return Covers.find();
});

Meteor.publish('ActiveCovers',function() {
	return Covers.find({isActive:true});
});

Meteor.publish('CategoriesList',function() {
	return Categories.find({},{
		sort:{
			order:1
		},
		fields:{
			title:1,
			slug:1,
			order:1,
			color:1,
			shortCut:1,
		}
	});
});

Meteor.publish('ProjectsListWithinCategory',function(catId) {
	check(catId, String);
	return Projects.find({$or:[{primaryCategory: catId},
		{secondaryCategory: catId},]},{
			sort:{
				order:1
			},
			fields:{
				title:1,
				slug:1,
				order:1,
				image:1,
				primaryCategory:1,
				secondaryCategory:1
			}
		});
});

Meteor.publish('AttachementsWithinCategory',function(catId) {
	check(catId, String);
	let att = Attachements.find({$or:[{primaryCategory: catId},
		{secondaryCategory: catId},]},{
			sort:{
				order:1
			},
		});
	let fls = [];
	att.forEach(function (item) {
		if (item.type=='File') {
			fls.push(item.file);
		}

	});
	let files = Files.find({_id:{$in:fls}}, {
		fields:{
			'original.name':1
		}
	});
	
	return [att, files];
});

// Meteor.publish('ProjectsTimeLine',(catId)=>{
// 	if (catId) {
// 		return Projects.find({$or:[{primaryCategory: catId},
// 		{secondaryCategory: catId},]},{
// 			sort:{
// 				endDate:-1
// 			},
// 			fields:{
// 				slug:1,
// 				primaryCategory:1,
// 				endDate:1,
// 			}
// 		});
// 	} else {
// 		return Projects.find({},{
// 			sort:{
// 				endDate:-1
// 			},
// 			fields:{
// 				slug:1,
// 				primaryCategory:1,
// 				endDate:1,
// 			}
// 		});
// 	}
// });

Meteor.publish('ProjectsFeed',function() {
	return Projects.find({},{
		fields:{
			order:1,
			title:1,
			primaryCategory:1,
			secondaryCategory:1,
			slug:1,
			endDate:1,
			'pages.slug':1,
			'pages.order':1
		}
	});
});

Meteor.publish('Category',function(catId){
	check(catId, String);
	return Categories.find({_id:catId});
});

Meteor.publish('Project',function (prjId){
	check(prjId, String);

	let project, project_unpublishedFields;

	project = Projects.find({_id:prjId});

	project_unpublishedFields = Projects.find({_id:prjId},{
		fields:{
			pages:1,
		}
	});

	Mongo.Collection._publishCursor(project_unpublishedFields, this, 'CC_Projects_unpublishedFields');

	return project;
});


