'use strict';

angular.module('CarreEntrySystem')
  .directive('carreViewPubmed', function(CONFIG) {
    return {
      templateUrl: 'app/components/view-pubmed/view-pubmed.html',
      restrict: 'E',
      replace: true,
      scope: {
        'id': '@'
      },
      controller: function($scope, Pubmed) {
      
        $scope.loading = Pubmed.fetch($scope.id).then(function(res) {
          $scope.pubmedArticle = res.data;
        });


        //debug
      }
    };
  });
