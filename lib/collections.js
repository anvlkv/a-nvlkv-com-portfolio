// collection to store images

var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
 stores: [imageStore]
});

// Images.deny({
//  insert: function(){
//  return false;
//  },
//  update: function(){
//  return false;
//  },
//  remove: function(){
//  return false;
//  },
//  download: function(){
//  return false;
//  }
// });

Images.allow({
	insert: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
	},
	download: function(){
		return true;
	}
});


// collection of project categories
Categories = new Mongo.Collection('categories');

Categories.allow({
	insert: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
 }
});


// collection of actual projects
Projects = new Mongo.Collection('projects');

Projects.allow({
	insert: function (userId, doc) {
		return true
	},
	update: function (userId, doc, fields, modifier) {
		return true
	},
	remove: function (userId, doc) {
		return true
	}
});


// collection of portfolio covers
Covers = new Mongo.Collection('covers');

Covers.allow({
	insert: function (userId, doc) {
		return true
	},
	update: function (userId, doc, fields, modifier) {
		return true
	},
	remove: function (userId, doc) {
		return true
	}
});
