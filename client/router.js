// main routing
// // // // // // // // // // // // // // // // // // // // // // 
// root
FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "landingPage"});
        GAnalytics.pageview();
    }
});


// portfolio

const portfolio = FlowRouter.group({
    prefix: "/portfolio",
});

// cover page
portfolio.route('/', {
    name: 'portfolio',
    action: function() {
        BlazeLayout.render("mainLayout", {
        	content: "portfolio",
        	pageType: "coverPage",
        	imagery: "background",
        	textContent: "aboutPortfolio",
			navContent: "coverNav",
        });
        GAnalytics.pageview();
    }
});

// category cover page
portfolio.route('/:category', {
    name: 'portfolio.category',
    action: function() {
        BlazeLayout.render("mainLayout", {
        	content: "portfolio",
        	pageType: "categoryPage",
        	imagery: "background",
        	textContent: "categoryCoverText",
			navContent: "categoryCoverMenu",
        });
        GAnalytics.pageview();
    }
});

// project cover page
portfolio.route('/:category/:project', {
    name: 'portfolio.project',
    action: function() {
        BlazeLayout.render("mainLayout", {
        	content: "portfolio",
        	pageType: "projectPage",
        	imagery: "background",
			textContent: "projectCoverText",
			navContent: "projectNav",
        });
        GAnalytics.pageview();
    }
});


// project page
portfolio.route('/:category/:project/:page', {
    name: 'portfolio.project.page',
        action: function() {
            BlazeLayout.render("mainLayout", {
            	content: "portfolio",
            	pageType: "projectPage",
            	imagery: "background",
    			textContent: "projectText",
    			navContent: "projectNav",
            });
            GAnalytics.pageview();
        }
});

// back-cover page
FlowRouter.route('/portfolio/back-cover', {
    name: 'portfolio.back-cover',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "coverView"});
        GAnalytics.pageview();
    }
});


FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    subscriptions: function() {

    },
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "errPage"});
    	GAnalytics.pageview();
    }
};