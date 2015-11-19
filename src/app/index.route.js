/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {

    $stateProvider
      .state('main', {
        'abstract': true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser': function(Auth) {
            return Auth.getUser();
          }
        }
      })
      .state('main.dashboard', {
        controller: 'MainController',
        controllerAs: 'main',
        url: '/',
        templateUrl: 'app/main/dashboard.html'
      })
      
      /*  Citations  */
      .state('main.citations', {
        'abstract':true,
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/main.html',
        url: '/citations'
      })
      .state('main.citations.list', {
        templateUrl: 'app/citations/list.html',
        url: ''
      })
      .state('main.citations.create', {
        templateUrl: 'app/citations/single/edit.create.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/create'
      })
      .state('main.citations.edit', {
        templateUrl: 'app/citations/single/edit.create.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/:id/edit'
      })
      .state('main.citations.view', {
        controller: 'citationsSingleController',
        templateUrl: 'app/citations/single/view.html',
        controllerAs: 'citation',
        url: '/:id'
      })
      
      /*  Observables  */
      .state('main.observables', {
        'abstract':true,
        controller: 'observablesController',
        controllerAs: 'observables',
        templateUrl: 'app/observables/main.html',
        url: '/observables'
      })
      .state('main.observables.list', {
        templateUrl: 'app/observables/list.html',
        url: ''
      })
      .state('main.observables.create', {
        templateUrl: 'app/observables/single/edit.create.html',
        controller: 'observablesSingleController',
        controllerAs: 'observable',
        url: '/create'
      })
      .state('main.observables.edit', {
        templateUrl: 'app/observables/single/edit.create.html',
        controller: 'observablesSingleController',
        controllerAs: 'observable',
        url: '/:id/edit'
      })
      .state('main.observables.view', {
        controller: 'observablesSingleController',
        templateUrl: 'app/observables/single/view.html',
        controllerAs: 'observable',
        url: '/:id'
      })
      
      /*  Risk Elements  */
      .state('main.risk_elements', {
        'abstract':true,
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        templateUrl: 'app/risk_elements/main.html',
        url: '/risk_elements'
      })
      .state('main.risk_elements.list', {
        templateUrl: 'app/risk_elements/list.html',
        url: ''
      })
      .state('main.risk_elements.create', {
        templateUrl: 'app/risk_elements/single/edit.create.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
        url: '/create'
      })
      .state('main.risk_elements.edit', {
        templateUrl: 'app/risk_elements/single/edit.create.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
        url: '/:id/edit'
      })
      .state('main.risk_elements.view', {
        controller: 'risk_elementsSingleController',
        templateUrl: 'app/risk_elements/single/view.html',
        controllerAs: 'risk_element',
        url: '/:id'
      })
      
      /*  risk_evidences  */
      .state('main.risk_evidences', {
        'abstract':true,
        controller: 'risk_evidencesController',
        controllerAs: 'risk_evidences',
        templateUrl: 'app/risk_evidences/main.html',
        url: '/risk_evidences'
      })
      .state('main.risk_evidences.list', {
        templateUrl: 'app/risk_evidences/list.html',
        url: ''
      })
      .state('main.risk_evidences.create', {
        templateUrl: 'app/risk_evidences/single/edit.create.html',
        controller: 'risk_evidencesSingleController',
        controllerAs: 'risk_evidence',
        url: '/create'
      })
      .state('main.risk_evidences.edit', {
        templateUrl: 'app/risk_evidences/single/edit.create.html',
        controller: 'risk_evidencesSingleController',
        controllerAs: 'risk_evidence',
        url: '/:id/edit'
      })
      .state('main.risk_evidences.view', {
        controller: 'risk_evidencesSingleController',
        templateUrl: 'app/risk_evidences/single/view.html',
        controllerAs: 'risk_evidence',
        url: '/:id'
      })
      
      /*  risk_factors  */
      .state('main.risk_factors', {
        'abstract':true,
        controller: 'risk_factorsController',
        controllerAs: 'risk_factors',
        templateUrl: 'app/risk_factors/main.html',
        url: '/risk_factors'
      })
      .state('main.risk_factors.list', {
        templateUrl: 'app/risk_factors/list.html',
        url: ''
      })
      .state('main.risk_factors.create', {
        templateUrl: 'app/risk_factors/single/edit.create.html',
        controller: 'risk_factorsSingleController',
        controllerAs: 'risk_factor',
        url: '/create'
      })
      .state('main.risk_factors.edit', {
        templateUrl: 'app/risk_factors/single/edit.create.html',
        controller: 'risk_factorsSingleController',
        controllerAs: 'risk_factor',
        url: '/:id/edit'
      })
      .state('main.risk_factors.view', {
        controller: 'risk_factorsSingleController',
        templateUrl: 'app/risk_factors/single/view.html',
        controllerAs: 'risk_factor',
        url: '/:id'
      })
      
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
  }

})();
