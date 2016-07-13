

// main routing
// // // // // // // // // // // // // // // // // // // // // // 
// root
const site = FlowRouter.group({
    prefix: '',
    triggersEnter:[function(){
        
        GAnalytics.pageview();

        this._startViewingRoute = new Date();


        if (!Session.get('consent') && !Cookie.get('a_nvlkv_consent')) {
            
            Session.set('active-overlay', 'consent');
            
            let route = FlowRouter.current();

            if (Object.keys(FlowRouter.current().queryParams).length > 0) {
                Session.set('consent-redirect', route.path);

                FlowRouter.setQueryParams({email:null, menu:null});
            }

        }else if (Cookie.get('a_nvlkv_consent')) {
            Session.set('consent', Cookie.get('a_nvlkv_consent'));
        }else if (Session.get('consent')==='cookies-only' || Session.get('consent')==='experiment'){
            Cookie.set('a_nvlkv_consent',Session.get('consent'));
        }
    }],
    triggersExit:[function(){
        GAnalytics.timing('time-on-page', FlowRouter.current().path, new Date() - this._startViewingRoute, visual_code);
    }],
});

site.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "landingPage"});
    }
});


// portfolio

const portfolio = site.group({
    prefix: "/portfolio",
});

// cover page
portfolio.route('/', {
    name: 'portfolio',
    action: function() {
        // front or back cover?
        let cvr = 'coverPage';
        if (Session.get('show-back-cover')) {
            cvr = 'backCover';
        }

        BlazeLayout.render("mainLayout", {
        	content: "portfolio",
        	pageType: cvr,
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
        });
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
    },
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
// portfolio.route('/portfolio/back-cover', {
//     name: 'portfolio.back-cover',
//     action: function() {
//         BlazeLayout.render("mainLayout", {content: "portfolio", pageType: "coverView"});
//     }
// });


FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    name: 'page.notFound',
    subscriptions: function() {

    },
    action: function() {
    	BlazeLayout.render("mainLayout", {content: "errPage"});
    }
};