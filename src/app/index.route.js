(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {


    $stateProvider
      .state('main', {
        abstract: true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser': function(Auth) {
            return Auth.getUser();
          },
          
          /*replace with a count for each element*/
          'citationsArray': function(CARRE) {
            return CARRE.instances('citation');
          },
          'risk_elementsArray': function(CARRE) {
            return CARRE.instances('risk_element');
          },
          'risk_factorsArray': function(CARRE) {
            return CARRE.instances('risk_factor');
          },
          'risk_evidencesArray': function(CARRE) {
            return CARRE.instances('risk_evidence');
          },
          'observablesArray': function(CARRE) {
            return CARRE.instances('observable');
          }
        }
      })
      .state('main.dashboard', {
        url: '/',
        templateUrl: 'app/main/dashboard.html'
      })
      
      .state('main.citations', {
        abstract:true,
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/main.html'
      })
      .state('main.citations.edit', {
        templateUrl: 'app/citations/edit/citation.edit.html',
        controller: 'citationsEditController',
        controllerAs: 'citationsEdit',
        url: '/citations/:id/edit'
      })
      .state('main.citations.view', {
        templateUrl: 'app/citations/view/citation.view.html',
        controller: 'citationsViewController',
        controllerAs: 'citationsView',
        url: '/citations/:id'
      })
      .state('main.citations.list', {
        templateUrl: 'app/citations/list.html',
        url: '/citations'
      })
      
      .state('main.observables', {
        controller: 'observablesController',
        controllerAs: 'observables',
        templateUrl: 'app/observables/list.html',
        url: '/observables'
      })
      .state('main.risk_evidences', {
        controller: 'risk_evidencesController',
        controllerAs: 'risk_evidences',
        templateUrl: 'app/risk_evidences/list.html',
        url: '/risk_evidences'
      })
      .state('main.risk_elements', {
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        templateUrl: 'app/risk_elements/list.html',
        url: '/risk_elements'
      })
      .state('main.risk_factors', {
        controller: 'risk_factorsController',
        controllerAs: 'risk_factors',
        templateUrl: 'app/risk_factors/list.html',
        url: '/risk_factors'
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
