'use strict';

angular.module('CarreEntrySystem')
  .directive('carreLinker', function(CONFIG) {
    return {
      templateUrl:'app/components/linker/linker.html',
      restrict: 'E',
      replace: true,
      scope: {
        'property': '@',
        'model': '='
      },
      controller: function($scope, CONFIG) {
        $scope.showlink=false;
        $scope.items=[];
        var label_arr=[];
        var arr = $scope.model[$scope.property];
        $scope.label=$scope.model[$scope.property+'_label'];
        if (arr instanceof Array) {
          label_arr = $scope.model[$scope.property+'_label_arr'];
         
          arr.forEach(function(str,index) {
            var id=str.substr(str.lastIndexOf('/')+1);
            var cat = id.substr(0, 2);
            var type=false;
            switch (cat) {
              case 'CI':
                // make label for observables
                type = 'citations/';
                break;
              case 'OB':
                // make label for observables
                type = 'observables/';
                break;
              case 'ME':
                // make label for measurent types
                type = 'measurement_types/';
                break;
              case 'RF':
                // make label for risk factor                          
                type = 'risk_factors/';
                break;
              case 'RL':
                // make label for risk element
                type = 'risk_elements/';
                break;
              case 'RV':
                // make label for risk evidence
                type = 'risk_evidences/';
                break;
              default:
            }
            if(type){
              $scope.showlink=true;
              $scope.items.push({
                link:(CONFIG.ENV==='PROD'?'':'#/')+type+id,
                label:label_arr[index]
              });
            }
            
          });
        }
        //debug
        // console.log('Label:',$scope.label,($scope.showlink?'link':'text'));
      }
    };
  });
