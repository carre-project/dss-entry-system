/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
     
      /*  dss_messages  */
      .state('main.dss_messages', {
        'abstract':true,
        templateUrl: 'app/pages/dss_messages/main.html',
        url: '/dss_messages'
      })
      .state('main.dss_messages.list', {
        controller: 'dss_messagesController',
        controllerAs: 'dss_messages',
        templateUrl: 'app/pages/dss_messages/list.html',
        url: ''
      })
      .state('main.dss_messages.create', {
        templateUrl: 'app/pages/dss_messages/single/single.html',
        controller: 'dss_messagesSingleController',
        controllerAs: 'dss_message',
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
      .state('main.dss_messages.edit', {
        templateUrl: 'app/pages/dss_messages/single/single.html',
        controller: 'dss_messagesSingleController',
        controllerAs: 'dss_message',
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
      .state('main.dss_messages.view', {
        controller: 'dss_messagesSingleController',
        templateUrl: 'app/pages/dss_messages/single/single.html',
        controllerAs: 'dss_message',
        url: '/:id'
      });
  }

})();
