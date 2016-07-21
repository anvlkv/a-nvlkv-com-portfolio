Consent = new ReactiveDict();

// main routing
// // // // // // // // // // // // // // // // // // // // // // 
// root
const site = FlowRouter.group({
    prefix: '',
    triggersEnter:[function(){
        
        GAnalytics.pageview();

        if (Cookie.get('a_nvlkv_consent')) {
            // Session.set('consent', Cookie.get('a_nvlkv_consent'));
            if (Cookie.get('a_nvlkv_consent')==='true') {
                Consent.set('cookies', true);
            }
        } else if (Consent.get('cookies')===undefined) {
            Session.set('active-notification', 'cookieNotification');
        }else if (Consent.get('cookies') && !Cookie.get('a_nvlkv_consent')){
            Cookie.set('a_nvlkv_consent', Consent.get('cookies'));
        }
    }],
});

site.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "landingPage"});
    },
    triggersEnter:[function(){
        Session.set('current-category', null);
        Session.set('current-project', null);
    }]
});


// portfolio

const portfolio = site.group({
    prefix: "/portfolio",
});

// cover page
portfolio.route('/', {
    name: 'portfolio',
    action: function() {
        BlazeLayout.render("mainLayout", {
        	content: "portfolio",
        	pageType: 'coverPage',
        	imagery: "background",
        	textContent: "aboutPortfolio",
			navContent: "coverNav",
        });
    },
});

portfolio.route('/thank-you',{
    name: 'portfolio.back-cover',
    action: function(){
        BlazeLayout.render("mainLayout", {
            content: "portfolio",
            pageType: 'backCover',
            imagery: "background",
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