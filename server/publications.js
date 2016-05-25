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

Meteor.publish('Images', ()=>{
	return Images.find();
});

Meteor.publish('Covers', ()=>{
	return Covers.find();
});