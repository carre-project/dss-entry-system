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
                'enableRotation': '@',
                'rotation': '=',
                'onlyPath':'=',
                'showRiskEvidences':'=',
                'ratioFilter':'=',
                
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
                
                var maxLimit = 5;
                var step = 0.2;
                var stepsArray = [];
                
                for(var i=0; i<=maxLimit; i=i+step){
                    stepsArray.push({value:i});
                }
                // vm.ratioFilter = 0;
                vm.slider_toggle = {
                    options: {
                        stepsArray:stepsArray,
                        floor: 0,    
                        translate: function(value) {
                            return ' ' + Number(value).toFixed(2);
                        }
                    }
                 };
            }
    	}
	});


