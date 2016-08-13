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
		autoform: {
			afFieldInput: {
				type: 'summernote',
				class: 'editor' // optional
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
				type: 'summernote',
				class: 'editor' // optional
			}
	    },
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
	    type: [Object],
	    label: "Responsive images",
	    optional: true,
	    // maxCount: 3,
	},
	'image.$.targetSize':{
		type: String,
		label: "Target screensize",
		optional: true,
		allowedValues: ['xs','sm','md','lg', 'any'],
		autoform:{
			type: "select2"
		}
	},
	'image.$.file':{
		type: String,
		label: "Image file",
		optional: true,
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Images"
			},
		},
	}
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
		// max: 300,
		autoform: {
			afFieldInput: {
				type: 'summernote',
				class: 'editor', // optional
				settings:{
					callbacks:{
						onKeyup:function(e) {
							let editor = $( this ).parent().find( '.note-editor .note-editable' ),
								text = editor.text();
							// set recomended length here
							if (text.length < 300) {
								editor.css({
									'background-color': ''
								});
								return e;

							}else{
								e.preventDefault();
								e.stopPropagation();
								editor.css({
									'background-color': '#f7688c'
								});
							}
						}
					}
				}
			}
	    },
		optional: true,
	},
	image: {
	    type: [Object],
	    label: "Responsive images",
	    optional: true,
	    // maxCount: 3,
	},
	'image.$.targetSize':{
		type: String,
		label: "Target screensize",
		optional: true,
		allowedValues: ['xs','sm','md','lg', 'any'],
		autoform:{
			type: "select2"
		}
	},
	'image.$.file':{
		type: String,
		label: "Image file",
		optional: true,
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Images"
			},
		},
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
				type: 'summernote',
				class: 'editor', // optional
				settings:{
					callbacks:{
						onKeyup:function(e) {
							let editor = $( this ).parent().find( '.note-editor .note-editable' ),
								text = editor.text();
							// set recomended length here
							if (text.length < 500) {
								editor.css({
									'background-color': ''
								});
								return e;

							}else{
								e.preventDefault();
								e.stopPropagation();
								editor.css({
									'background-color': '#f7688c'
								});
							}
						}
					}
				}
			}
	    },
		// max: 700
	},
	"pages.$.image": {
	    type: [Object],
	    label: "Responsive images",
	    optional: true,
	    // maxCount: 3,
	},
	'pages.$.image.$.targetSize':{
		type: String,
		label: "Target screensize",
		optional: true,
		allowedValues: ['xs','sm','md','lg', 'any'],
		autoform:{
			type: "select2"
		}
	},
	'pages.$.image.$.file':{
		type: String,
		label: "Image file",
		optional: true,
		autoform:{
			afFieldInput:{
				type: "fileUpload",
				collection: "Images"
			},
		},
	}

});

Schemas.Covers = new SimpleSchema({
	image: {
	    type: [Object],
	    label: "Responsive images",
	},
	'image.$.targetSize':{
		type: String,
		label: "Target screensize",
		optional: true,
		allowedValues: ['xs','sm','md','lg', 'any'],
		autoform:{
			type: "select2"
		}
	},
	'image.$.file':{
		type: String,
		label: "Image file",
		optional: true,
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
