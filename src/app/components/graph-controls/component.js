'use strict';

angular.module('CarreEntrySystem')
	.directive('carreGraphControls',function(){
		return {
            templateUrl:'app/components/graph-controls/template.html',
            restrict: 'E',
            replace: false,
            bindToController: {
                'selectedId': '=',
                'disableOptions':'=',
                'slider': '=',
                'onlyPath':'=',
                'showRiskEvidences':'=',
                
                //functions
                'refresh':'&',
                'addSize':'&',
                'removeSize':'&',
                'navigate':'&',
                'expand':'&',
                'clear':'&'
            },
            controllerAs:'controls',
            scope: true,
            controller:function($timeout,CONFIG,content,$scope){
                var vm = this;
                
                $scope.$watch('selectedId',function(n,o){ 
                    //hack for refresh element
                    if(n && n!==o && $scope.showDetails){ 
                        $scope.showDetails=false;
                        $timeout(function(){ $scope.showDetails=true; });
                    }
                }.bind(this));
                
                $scope.applyRefresh = function (){
                    $timeout(function() { vm.refresh({}); },0);
                }
                
                vm.user = CONFIG.currentUser.username;
                vm.getType=content.typeFromId;
            }
    	}
	});


