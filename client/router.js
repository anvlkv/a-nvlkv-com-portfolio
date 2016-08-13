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
        BlazeLayout.render('mainLayout', {
            content: 'landingPage',
            navigation: 'topLevelMenu'
        });
    },
    triggersEnter:[function(){
        Session.set('current-category', null);
        Session.set('current-project', null);
    }]
});


// portfolio

const portfolio = site.group({
    prefix: '/portfolio',
});

// cover page
portfolio.route('/', {
    name: 'portfolio',
    action: function() {
        BlazeLayout.render('mainLayout', {
            content: 'portfolio',
            navigation: 'topLevelMenu',
            pageType: 'coverSlide',
        });
    },
});

// back cover
portfolio.route('/thank-you',{
    name: 'portfolio.back-cover',
    action: function(){
        BlazeLayout.render('mainLayout', {
            content: 'portfolio',
            pageType: 'backCover',
            navigation: 'topLevelMenu'
        });
    }
});


// year cover page
portfolio.route('/year/:year',{
    name: 'portfolio.year',
    action: function(){
        BlazeLayout.render('mainLayout', {
            content: 'portfolio',
            pageType: 'yearSlide',
            navigation: 'yearLevelMenu',
        });
    }
});

// project in timeline
portfolio.route('/year/:year/:project',{
    name: 'portfolio.date',
    action: function(){
        BlazeLayout.render('mainLayout', {
            content: 'portfolio',
            pageType: 'projectSlide',
            navigation: 'dateLevelMenu',
        });
    }
});
// project page in timeline
portfolio.route('/year/:year/:project/:page',{
    name: 'portfolio.date.page',
    action: function(){
        BlazeLayout.render('mainLayout', {
            content: 'portfolio',
            pageType: 'projectSlide',
            navigation: 'datePageLevelMenu',
        });
    }
});

// category cover page
portfolio.route('/:category', {
    name: 'portfolio.category',
    action: function() {
        BlazeLayout.render('mainLayout', {
        	content: 'portfolio',
        	pageType: 'categorySlide',
			navigation: 'categoryLevelMenu',
        });
    }
});

// project cover page
portfolio.route('/:category/:project', {
    name: 'portfolio.project',
    action: function() {
        BlazeLayout.render('mainLayout', {
        	content: 'portfolio',
        	pageType: 'projectSlide',
            navigation: 'projectLevelMenu'
        });
    },
});


// project page
portfolio.route('/:category/:project/:page', {
    name: 'portfolio.project.page',
        action: function() {
            BlazeLayout.render('mainLayout', {
                content: 'portfolio',
                pageType: 'projectSlide',
                navigation: 'projectPageLevelMenu'
            });
        }
});



FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    name: 'page.notFound',
    subscriptions: function() {

    },
    action: function() {
    	BlazeLayout.render('mainLayout', {content: 'errPage'});
    }
};