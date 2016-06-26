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
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin"});
    }
});

var portfolioSection = adminSection.group({
    name: 'admin-portfolio-routes',
    prefix: '/portfolio'
})

portfolioSection.route('/', {
    name:'admin.portfolio',
    action: function() {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editor:"newObjectPanel"});
    }
});

// managing projects
// new project page
portfolioSection.route('/new-project', {
	name:'newProject',
    action: function() {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editor:"projectEditor"});
    }
});
// edit project page
portfolioSection.route('/edit-project/:project_id', {
	name:'editProject',
    action: function(params) {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editProjectID:params.project_id});
    }
});




// managing categories of projects
// new category form
portfolioSection.route('/new-category', {
	name:'newCategory',
    action: function() {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editor:"categoryEditor"});
    }
});
// edit existing category
portfolioSection.route('/edit-category/:category_id', {
	name:'editCategory',
    action: function(params) {
    	BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editCategoryID:params.category_id});
    }
});


// managing covers
// new cover form
portfolioSection.route('/new-cover', {
    name:'newCover',
    action: function() {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editor:"coverEditor"});
    }
});
// edit existing cover
portfolioSection.route('/edit-cover/:cover_id', {
    name:'editCcover',
    action: function(params) {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editCoverID:params.cover_id});
    }
});


// managing attachements
// new attachement form
portfolioSection.route('/new-attachement', {
    name:'newAttachement',
    action: function() {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editor:"attachementEditor"});
    }
});
// edit existing cover
portfolioSection.route('/edit-attachement/:attachement_id', {
    name:'editAttachement',
    action: function(params) {
        BlazeLayout.render("adminLayout", {content: "dashboard", navigation:"navPanelAdmin", dashboardType:"portfolioDashboard", editCoverID:params.attachement_id});
    }
});
