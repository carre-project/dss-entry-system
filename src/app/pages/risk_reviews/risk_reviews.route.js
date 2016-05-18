/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
      
      /*  Reviews  */
      .state('main.risk_reviews', {
        'abstract':true,
        templateUrl: 'app/pages/risk_reviews/main.html',
        url: '/reviews'
      })
      .state('main.risk_reviews.list', {
        controller: 'risk_reviewsController',
        controllerAs: 'risk_reviews',
        templateUrl: 'app/pages/risk_reviews/list.html',
        url: ''
      })
      .state('main.risk_reviews.create', {
        templateUrl: 'app/pages/risk_reviews/single/single.html',
        controller: 'risk_reviewsSingleController',
        controllerAs: 'risk_review',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              window.location.replace(window.location.href.replace('/edit','').replace('/create',''));
            }        
            
          }
        }
      })
      .state('main.risk_reviews.edit', {
        templateUrl: 'app/pages/risk_reviews/single/single.html',
        controller: 'risk_reviewsSingleController',
        controllerAs: 'risk_review',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              window.location.replace(window.location.href.replace('/edit','').replace('/create',''));
            }        
            
          }
        }
        
      })
      .state('main.risk_reviews.view', {
        controller: 'risk_reviewsSingleController',
        templateUrl: 'app/pages/risk_reviews/single/single.html',
        controllerAs: 'risk_review',
        url: '/:id'
      });
  }

})();
