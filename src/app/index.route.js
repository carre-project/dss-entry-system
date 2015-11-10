(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider,$urlRouterProvider) {
    
        
    $stateProvider
      .state('main', {
        abstract: true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser':function(Auth){
            return Auth.getUser();
          },
          'citationsArray': function(CARRE){
               return CARRE.instances('citation');
          },
          'risk_elementsArray': function(CARRE){
               return CARRE.instances('risk_element');
          },
          'risk_factorsArray': function(CARRE){
               return CARRE.instances('risk_factor');
          },
          'risk_evidencesArray': function(CARRE){
               return CARRE.instances('risk_evidence');
          },
          'observablesArray': function(CARRE){
               return CARRE.instances('observable');
          }
        }
      })
      .state('main.dashboard', {
        url: '/',
        templateUrl: 'app/main/dashboard.html',
      })
      .state('main.citations', {
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/listcitations.html',
        url: '/citations'
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
  }

})();
