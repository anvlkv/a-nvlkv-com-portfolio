// admin routing
// // // // // // // // // // // // // // // // // // // // // // 
var adminSection = FlowRouter.group({
    prefix: "/admin"
});

// for the /admin page
adminSection.route('/', {
	name: 'admin',
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "dashboard", dashboard_content:"dashboardPannel"});
    }
});


// managing projects
// new project page
adminSection.route('/new-project', {
	name:'newProject',
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "dashboard", dashboard_content:"projectEditor"});
    }
});
// edit project page
adminSection.route('/edit-project/:project_id', {
	name:'newProject',
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "dashboard", dashboard_content:"projectEditor"});
    }
});




// managing categories of projects
// new category form
adminSection.route('/new-category', {
	name:'newCategory',
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "dashboard", dashboard_content:"categoryEditor"});
    }
});
// edit existing category
adminSection.route('/edit-category/:category_id', {
	name:'editCategory',
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "dashboard", dashboard_content:"categoryEditor"});
    }
});


// main routing
// // // // // // // // // // // // // // // // // // // // // // 
// root
FlowRouter.route('/', {
    name: 'root',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "dummy"});
    }
});


// portfolio
FlowRouter.route('/portfolio', {
    name: 'portfolio',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio"});
    }
});
