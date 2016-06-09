'use strict';

angular.module('CarreEntrySystem')
	.directive('carreGraphControls',function(){
		return {
            templateUrl:'app/components/graph-controls/template.html',
            restrict: 'E',
            replace: false,
            bindToController: {
                
                // variables
                'selectedId': '=',
                'disableOptions':'=?',
                'enableRotation': '@',
                'rotation': '=?',
                'onlyPath':'=?',
                'showRiskEvidences':'=?',
                'ratioFilter':'=?',
                
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
                    $timeout(function() { 
                        vm.refresh({}); 
                        // show slider only when risk evidences exist
                        if(vm.showRiskEvidences)  {
                            $scope.$broadcast('rzSliderForceRender'); 
                            vm.showSlider = true;
                        } else vm.showSlider = false;
                    },0);
                };
                
                vm.user = CONFIG.currentUser.username;
                vm.getType=content.typeFromId;
                
                // Slider configuration
                vm.showSlider = vm.showRiskEvidences?true:false;
                var maxLimit = 50.5;
                var step = 0.5;
                var stepsArray = [];
                for(var i=0; i<maxLimit; i=i+step){ stepsArray.push( Number(Math.round(i+'e2')+'e-2') );}
                vm.slider_toggle = {
                    options: {
                        stepsArray:stepsArray
                    }
                };
                
            }
    	};
	});


