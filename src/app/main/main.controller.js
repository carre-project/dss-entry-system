(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, $timeout, toastr, $location, CONFIG, Auth) {
    var vm = this;
    
    
    
    vm.config = CONFIG;
    vm.user = vm.config.currentUser || {};
    CONFIG.ROOT_URL=rootUrl();
    
    //clean up the browser url
    $location.url($location.path());

    //set up the urls 
    vm.loginUrl = CONFIG.CARRE_DEVICES + 'login?next=';
    vm.logoutUrl = CONFIG.CARRE_DEVICES + 'logout?next=';
    vm.settingsUrl = CONFIG.CARRE_DEVICES + 'settings';
    vm.passwordUrl = CONFIG.CARRE_DEVICES + 'recover?next=';

    
    //show message for the user
    if(vm.user.username){
      toastr.success('Have fun with the risk factors!','<h4>Hi '+vm.user.username+'!</h4>');
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
