(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    
        
    $stateProvider
      .state('main', {
        abstract:true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser':function(Auth){
            return Auth.getUser();
          }
        }
      })
      .state('main.dashboard', {
        url: '/',
        templateUrl: 'app/main/dashboard.html',
        resolve: {
        }
      })
      .state('main.citations', {
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/listcitations.html',
        url: '/citations',
        resolve: {
          citationsList: function(CARRE){
               return CARRE.instances('citation');
          }
        }
      })
      // .state('main.observables', {
      //   controller: 'observablesController',
      //   controllerAs: 'observables',
      //   templateUrl: 'app/observables/listobservables.html',
      //   url: '/observables',
      //   resolve: {
      //     observablesList: function(CARRE){
      //         return CARRE.instances('observable');
      //     }
      //   }
      // })
      // .state('main.citations', {
      //   controller: 'CitationsController',
      //   controllerAs: 'citations',
      //   templateUrl: 'app/citations/listcitations.html',
      //   url: '/citations',
      //   resolve: {
      //     CitationsList: function(CARRE){
      //         return CARRE.instances('citation');
      //     }
      //   }
      // })
      // .state('main.citations', {
      //   controller: 'CitationsController',
      //   controllerAs: 'citations',
      //   templateUrl: 'app/citations/listcitations.html',
      //   url: '/citations',
      //   resolve: {
      //     CitationsList: function(CARRE){
      //         return CARRE.instances('citation');
      //     }
      //   }
      // })
      // .state('main.citations', {
      //   controller: 'CitationsController',
      //   controllerAs: 'citations',
      //   templateUrl: 'app/citations/listcitations.html',
      //   url: '/citations',
      //   resolve: {
      //     CitationsList: function(CARRE){
      //         return CARRE.instances('citation');
      //     }
      //   }
      // })
      .state('500_error', {
        templateUrl: '500.html',
        url: '/500_error'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
      
  $urlRouterProvider.otherwise('404_error');
  }

})();
