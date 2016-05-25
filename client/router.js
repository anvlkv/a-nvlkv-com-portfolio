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
// cover page
FlowRouter.route('/portfolio', {
    name: 'portfolio',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "coverView"});
    }
});

// category cover page
FlowRouter.route('/portfolio/:category', {
    name: 'portfolio.category',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "categoryView"});
    }
});

// project page
FlowRouter.route('/portfolio/:category/:project', {
    name: 'portfolio.project',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "projectView"});
    }
});


// project page
FlowRouter.route('/portfolio/:category/:project/:page', {
    name: 'portfolio.project.page',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "projectPageView"});
    }
});

// back-cover page
FlowRouter.route('/portfolio/back-cover', {
    name: 'portfolio.back-cover',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "coverView"});
    }
});


FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    subscriptions: function() {

    },
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "dummy"});
    }
};