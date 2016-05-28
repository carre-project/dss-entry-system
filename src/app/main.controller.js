(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, $location, CONFIG,CARRE,$state,SweetAlert) {
    var vm = this;
    
    CONFIG.ROOT_URL=rootUrl();
    vm.config = CONFIG;
    vm.user = vm.config.currentUser || {};
    
    
    //clean up the browser url
    // $location.url($location.path());

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
    
    

    vm.deleteCurrent = function(id) {
      if(!id) return;
      SweetAlert.swal({
          title: "Are you sure?",
          text: "Your will not be able to recover this element!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) { 
            if(CONFIG.AllowDelete) {
              CARRE.delete(id).then(function() { $state.go('^.list'); }); 
            } else {
              toastr.info(id+' deleted!','DEBUG');
              $timeout(function(){ $state.go('^.list') },500);
            }
          }
        });
    };

  }
})();
