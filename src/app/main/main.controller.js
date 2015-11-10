(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
      return function(val) {
        return $sce.trustAsResourceUrl(val);
      };
    }])
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, Citations, currentUser, $location, CONFIG) {
    var vm = this;


    vm.user = currentUser;
    vm.config = CONFIG;
    //clean up the browser url
    $location.url($location.path());
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

  }
})();
