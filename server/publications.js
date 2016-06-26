Meteor.publish('Categories', ()=>{
	return Categories.find({},{
		sort:{
			order:1
		}
	});
});

Meteor.publish('Projects', ()=>{
	return Projects.find();
});

Meteor.publish('Attachements', ()=>{
	return Attachements.find();
});

Meteor.publish('Images', ()=>{
	return Images.find();
});

Meteor.publish('Files', ()=>{
	return Files.find();
});

Meteor.publish('Covers', ()=>{
	return Covers.find();
});

Meteor.publish('ActiveCovers',()=>{
	return Covers.find({isActive:true});
});

Meteor.publish('CategoriesList',()=>{
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

Meteor.publish('ProjectsListWithinCategory',(catId)=>{
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
				secondaryCategory:1,
			}
		});
});

Meteor.publish('AttachementsWithinCategory',(catId)=>{
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
			"original.name":1
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

Meteor.publish('ProjectsFeed',()=>{
	return Projects.find({},{
		fields:{
			order:1,
			title:1,
			primaryCategory:1,
			secondaryCategory:1,
			slug:1,
			endDate:1,
		}
	});
});

Meteor.publish('Category',(catId)=>{
	return Categories.find({_id:catId});
});

Meteor.publish('Project',(prjId)=>{
	return Projects.find({_id:prjId});
});


