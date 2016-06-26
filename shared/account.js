AccountsTemplates.configure({
    forbidClientAccountCreation: true,
    onLogoutHook: function(){
    	FlowRouter.go('/');
    },
    onSubmitHook: function (error, state){
    	// console.log(error);
    	// console.log(state);
    	if (!error){
    		if (Session.get('redirectAfterLogin')) {
    			FlowRouter.go(Session.get('redirectAfterLogin'));
    		} else {
    			FlowRouter.go('/admin');
    		}
    	}
    },

});