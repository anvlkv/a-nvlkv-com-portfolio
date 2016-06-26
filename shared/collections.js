// Schemas

const Schemas = {};

Schemas.Categories = new SimpleSchema({
	title: {
		type: String,
		label: "Title",
		max: 200
	},
	slug: {
		type: String,
		label:'Slug',
		unique: true,
	},
	order:{
		type: Number,
		label: "Order",
		unique: true,
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'number',
				defaultValue: ()=>{
					return Categories.find().count() + 1;
				}
			}
		}
	},
	shortCut: {
		type: String,
		label: "Letters",
		max: 3
	},
	description: {
		type: String,
		label: "Description",
		max: 500,
		autoform: {
			afFieldInput: {
				type: 'textarea'
			}
		},
		optional: true,
	},
	summary: {
		type: String,
		label: "Summary",
		max: 500,
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'textarea'
			}
		}
	},
	color: {
		type: String,
		label: "Color",
		autoform: {
			type: "bootstrap-minicolors"
	    },
	    optional: true,
	},
	image: {
	    type: String,
	    label: "Background image",
	    autoform:{
	    	afFieldInput:{
	    		type: "fileUpload",
	    		collection: "Images"
	    	},
	    },
	    optional: true,
	},
});

Schemas.Projects = new SimpleSchema({
	title:{
		type: String,
		label: "Title",
		max: 200
	},
	slug: {
		type: String,
		label:'Slug',
		unique: true
	},
	order:{
		type: Number,
		label: "Order",
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'number'
			}
		}
	},
	description: {
		type: String,
		label: "Description",
		max: 500,
		autoform: {
			afFieldInput: {
				type: 'textarea'
			}
		},
		optional: true,
	},
	image: {
	    type: String,
	    label: "Background image",
	    autoform:{
	    	afFieldInput:{
	    		type: "fileUpload",
	    		collection: "Images"
	    	},
	    },
	    optional: true,
	},
	primaryCategory:{
		type: String,
		label: "Primary category",
		autoform:{
			type: "select2",
			options: ()=>{
				let categories = Categories.find();
				let options = [];
				categories.forEach((category)=>{
					options.push({
						label: category.title,
						value: category._id
					});
				});
				return options;
			},
		}

	},
	secondaryCategories:{
		type: [String],
		optional: true,
		label: "Secondary categories",
		autoform:{
			type: "select2",
			options: ()=>{
				let categories = Categories.find();
				let options = [];
				categories.forEach((category)=>{
					options.push({
						label: category.title,
						value: category._id
					});
				});
				return options;
			},
			afFieldInput:{
				multiple:true
			}
		}

	},
	startDate:{
		type: Date,
		optional: true
	},
	endDate:{
		type: Date,
		optional: true
	},
	pages:{
		type: [Object],
		optional: true,
		autoform: {
			afFieldInput: {
				defaultValue: []
			}
		}
	},
	"pages.$.order":{
		type: Number,
		label: "Order",
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'number',
			}
		}
	},
	"pages.$.slug": {
		type: String,
		label:'Slug',
		optional: true,
	},
	"pages.$.text":{
		type: String,
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'textarea'
			}
		},
		max: 500
	},
	"pages.$.image":{
		type: String,
		label: "Background image",
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Images"
			},
		},
		optional: true,
	},

});

Schemas.Covers = new SimpleSchema({
	image:{
		type: String,
		label: "Background image",
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Images"
			},
		},
	},
	dateOfIssue:{
		type: Date,
		autoform:{
			afFieldInput:{
				defaultValue:()=>{
					return new Date();
				}
			}
		}
	},
	slug: {
		type: String,
		label:'Slug',
		unique: true
	},
	isActive:{
		type: Boolean,
		label: "Is current cover"
	},
	isBack:{
		type: Boolean,
		label: "Is back cover"
	}
});

Schemas.Attachements = new SimpleSchema({
	title:{
		type: String,
		label: "Title"
	},
	order:{
		type: Number,
		label: "Order",
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'number'
			}
		}
	},
	image:{
		type: String,
		label: "Thumbnail image",
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Images"
			},
		}
	},
	type:{
		type: String,
		label: "Type of attachement",
		autoform:{
			type: "select2"
		}
	},
	file:{
		type: String,
		label: "File",
		optional: true,
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Files"
			},
		}
	},
	url:{
		type: String,
		label: "Link",
		optional: true,
	},
	primaryCategory:{
		type: String,
		label: "Primary category",
		autoform:{
			type: "select2",
			options: ()=>{
				let categories = Categories.find();
				let options = [];
				categories.forEach((category)=>{
					options.push({
						label: category.title,
						value: category._id
					});
				});
				return options;
			},
		}

	},
	secondaryCategories:{
		type: [String],
		optional: true,
		label: "Secondary categories",
		autoform:{
			type: "select2",
			options: ()=>{
				let categories = Categories.find();
				let options = [];
				categories.forEach((category)=>{
					options.push({
						label: category.title,
						value: category._id
					});
				});
				return options;
			},
			afFieldInput:{
				multiple:true
			}
		}

	},
});

// collections

// collection to store images

const imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
 stores: [imageStore]
});

// collection to store files
const fileStore = new FS.Store.GridFS("files");

Files = new FS.Collection("files", {
 stores: [fileStore]
});


// collection of project categories
Categories = new Mongo.Collection('categories');

Categories.attachSchema(Schemas.Categories);


// collection of actual projects
Projects = new Mongo.Collection('projects');

Projects.attachSchema(Schemas.Projects);

// ProjectsTimeline = new Mongo.Collection('projects');


// collection of attachements
Attachements = new Mongo.Collection('attachements');

Attachements.attachSchema(Schemas.Attachements);

// collection of portfolio covers
Covers = new Mongo.Collection('covers');

Covers.attachSchema(Schemas.Covers);


// save email messages
EmailMessages = new Mongo.Collection('emailMessages');



Images.allow({
	insert: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	update: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	remove: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	download: function(){
		return true;
	}
});

Files.allow({
	insert: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	update: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	remove: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	download: function(){
		return true;
	}
});

Categories.allow({
	insert: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	update: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	remove: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	}
});

Projects.allow({
	insert: function (userId, doc) {
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	update: function (userId, doc, fields, modifier) {
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	remove: function (userId, doc) {
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	}
});

Attachements.allow({
	insert: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	update: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	remove: function(userId){
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	}
});

Covers.allow({
	insert: function (userId, doc) {
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}

	},
	update: function (userId, doc, fields, modifier) {
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	},
	remove: function (userId, doc) {
		if (userId) {
			return true;
		} else {
			// FlowRouter.go('/sign-in');
			return false;
		}
	}
});

EmailMessages.allow({
	insert: function (userId, doc) {
		return true;
	}
});


// simple checks
function simpleCheck (userId){
	if (userId) {
		return true;
	} else {
		// FlowRouter.go('/sign-in');
		return false;
	}
}
