(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    
        
    $stateProvider
      .state('dashboard', {
        url: '/',
        templateUrl: 'app/views/dashboard/main.html',
        resolve: {
        }
      })
      .state('dashboard.home', {
        url: '/home',
        controller: 'MainController',
        templateUrl: 'app/views/dashboard/home.html',
        resolve: {
        }
      })
      .state('dashboard.form', {
        templateUrl: 'app/views/form.html',
        url: '/form'
      })
      .state('dashboard.blank', {
        templateUrl: 'app/views/pages/blank.html',
        url: '/blank'
      })
      .state('login', {
        templateUrl: 'app/views/pages/login.html',
        url: '/login'
      })
      .state('dashboard.table', {
        templateUrl: 'app/views/table.html',
        url: '/table'
      })
      .state('dashboard.panels-wells', {
        templateUrl: 'app/views/ui-elements/panels-wells.html',
        url: '/panels-wells'
      })
      .state('dashboard.buttons', {
        templateUrl: 'app/views/ui-elements/buttons.html',
        url: '/buttons'
      })
      .state('dashboard.notifications', {
        templateUrl: 'app/views/ui-elements/notifications.html',
        url: '/notifications'
      })
      .state('dashboard.typography', {
        templateUrl: 'app/views/ui-elements/typography.html',
        url: '/typography'
      })
      .state('dashboard.icons', {
        templateUrl: 'app/views/ui-elements/icons.html',
        url: '/icons'
      })
      .state('dashboard.grid', {
        templateUrl: 'app/views/ui-elements/grid.html',
        url: '/grid'
      })
      .state('500_error', {
        templateUrl: '500.html',
        url: '/500_error'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
      
    
    
    // $stateProvider
    //   .state('home', {
    //     url: '/',
    //     templateUrl: 'app/main/main.html',
    //     controller: 'MainController',
    //     controllerAs: 'main'
    //   });
 //$urlRouterProvider.otherwise('404_error');
    $urlRouterProvider.otherwise('/');
  }

})();
