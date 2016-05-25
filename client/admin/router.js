// admin routing
// // // // // // // // // // // // // // // // // // // // // //
// signIn
FlowRouter.route('/sign-in',{
    name:'sign-in',
    triggersEnter:[function(){
        if (Meteor.user()) {
           FlowRouter.go('/admin');
        }
    }],
    action: function(){
        BlazeLayout.render("adminLayout", {content: "atForm"});
    }
});


var adminSection = FlowRouter.group({
    prefix: "/admin",
    name:"admin-routes",
    triggersEnter:[function(){
        console.log('entering admin path')
        route = FlowRouter.current()
        if (!Meteor.user()) {
            console.log('no active user at the moment')
            if (!Meteor.loggingIn()) {
                console.log('neither they are trying to log in');
                console.log('redirecting to sign-in')
                Session.set('redirectAfterLogin', route.path);
                FlowRouter.go('/sign-in');
            }
        }
    }],
});

// for the /admin page
adminSection.route('/', {
	name: 'admin',
    action: function() {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editor:"newObjectPanel"});
    }
});


// managing projects
// new project page
adminSection.route('/new-project', {
	name:'newProject',
    action: function() {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editor:"projectEditor"});
    }
});
// edit project page
adminSection.route('/edit-project/:project_id', {
	name:'editProject',
    action: function(params) {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editProjectID:params.project_id});
    }
});




// managing categories of projects
// new category form
adminSection.route('/new-category', {
	name:'newCategory',
    action: function() {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editor:"categoryEditor"});
    }
});
// edit existing category
adminSection.route('/edit-category/:category_id', {
	name:'editCategory',
    action: function(params) {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editCategoryID:params.category_id});
    }
});


// managing covers
// new cover form
adminSection.route('/new-cover', {
    name:'newCover',
    action: function() {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editor:"coverEditor"});
    }
});
// edit existing cover
adminSection.route('/edit-cover/:cover_id', {
    name:'editCcover',
    action: function(params) {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", editCoverID:params.cover_id});
    }
});
