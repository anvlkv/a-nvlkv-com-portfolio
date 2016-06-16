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
			galleryContent: "galleryGrid",
        });
    }
});

// project page
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