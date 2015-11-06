(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr,Citations,currentUser,$location,CONFIG) {
    var vm = this;

    
    vm.user=currentUser;
    vm.config=CONFIG;
    //clean up the browser url
    $location.url('/').replace();
    var baseUrl = $location.absUrl();
    
    //set up the urls 
    vm.loginUrl = CONFIG.CARRE_DEVICES + 'login?next=' + baseUrl;
    vm.logoutUrl = CONFIG.CARRE_DEVICES + 'logout?next=' + baseUrl;
    
    
    // activate();

    // function activate() {
    //   getWebDevTec();
    //   $timeout(function() {
    //     vm.classAnimation = 'rubberBand';
    //   }, 4000);
    // }

    // function showToastr() {
    //   toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    //   vm.classAnimation = '';
    // }

    // function getWebDevTec() {
    //   vm.awesomeThings = webDevTec.getTec();

    //   angular.forEach(vm.awesomeThings, function(awesomeThing) {
    //     awesomeThing.rank = Math.random();
    //   });
    // }


    vm.goto='dashboard.home';
    
    var citation='<http://carre.kmi.open.ac.uk/citations/15385656>';
    if(currentUser){
      Citations.get().success(function(data) {
          
          
          console.log('Raw Data: ',data); 
          
          vm.queryResult={
            'error': !(data instanceof Array),
            'data': data
          }
      });
    }
      
  }
})();
