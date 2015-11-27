(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, $timeout, toastr ,currentUser, $location, CONFIG) {
    var vm = this;

    vm.user = currentUser;
    vm.config = CONFIG;
    CONFIG.ROOT_URL=rootUrl();
    
    //clean up the browser url
    $location.url($location.path());
    var baseUrl = $location.absUrl();

    //set up the urls 
    vm.loginUrl = CONFIG.CARRE_DEVICES + 'login?next=' + baseUrl;
    vm.logoutUrl = CONFIG.CARRE_DEVICES + 'logout?next=' + baseUrl;
    vm.settingsUrl = CONFIG.CARRE_DEVICES + 'settings';
    vm.passwordUrl = CONFIG.CARRE_DEVICES + 'recover?next=' + baseUrl;

    
    //show message for the user
    if(currentUser.username){
      toastr.success('Have fun with the risk factors!','<h4>Hi '+currentUser.username+'!</h4>');
    } else {
      toastr.info('Please login if you want to add/edit data.','<h4>Hello Guest!</h4>');
    }

    

    function rootUrl(){
      if(CONFIG.ENV==='DEV'){
        return window.location.host+'/#/';
      } else if(CONFIG.ENV==='PROD'){
        return window.location.host+'/';
      }
    }

  }
})();
