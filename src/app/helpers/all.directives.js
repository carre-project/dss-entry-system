/* global angular */
(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .directive('uiSrefActiveIf', uiSrefActiveIfDirective)
        .directive('countTo', countToDirective);

    /** @ngInject */
    function uiSrefActiveIfDirective($state) {
        return {
            restrict: "A",
            controller: ['$scope', '$element', '$attrs', 'CONFIG', function($scope, $element, $attrs, CONFIG) {
                
                var menuColor=function(state){
                    var elem=state.substr(state.lastIndexOf('.')+1);
                    console.log(elem);
                    var color="";
                    switch (elem) {
                        case 'risk_factors':
                            color=CONFIG.COLORS[0];
                            break;
                        case 'risk_evidences':
                            color=CONFIG.COLORS[1];
                            break;
                        case 'risk_elements':
                            color=CONFIG.COLORS[2];
                            break;
                        case 'observables':
                            color=CONFIG.COLORS[3];
                            break;
                        case 'citations':
                            color=CONFIG.COLORS[4];
                            break;
                        
                        default:
                            color="#EEEEEE";
                    }
                    return color;
                }
                function update() {
                    var state = $attrs.uiSrefActiveIf;
                    if ($state.includes(state) || $state.is(state)) {
                            // console.log(state,$state.includes(state),$state.is(state))
                            $element.css("border-right","5px solid "+menuColor(state))
                            $element.addClass("active");
                    }
                    else {
                        // angular.element("#side-menu li").each(function() {
                        //   $( this ).removeClass("active");
                        // });
                        $element.css("border-right","none");
                        $element.removeClass("active");
                    }
                }

                $scope.$on('$stateChangeSuccess', update);
                update();
            }]
        };
    }
    
    /** @ngInject */
    function countToDirective($timeout) {
        return {
            replace: false,
            scope: true,
            link: function (scope, element, attrs) {

                var e = element[0];
                var num, refreshInterval, duration, steps, step, countTo, value, increment;

                var calculate = function () {
                    refreshInterval = 30;
                    step = 0;
                    scope.timoutId = null;
                    countTo = parseInt(attrs.countTo) || 0;
                    scope.value = parseInt(attrs.value, 10) || 0;
                    duration = (parseFloat(attrs.duration) * 1000) || 0;

                    steps = Math.ceil(duration / refreshInterval);
                    increment = ((countTo - scope.value) / steps);
                    num = scope.value;
                };

                var tick = function () {
                    scope.timoutId = $timeout(function () {
                        num += increment;
                        step++;
                        if (step >= steps) {
                            $timeout.cancel(scope.timoutId);
                            num = countTo;
                            e.textContent = countTo;
                        } else {
                            e.textContent = Math.round(num);
                            tick();
                        }
                    }, refreshInterval);

                };

                var start = function () {
                    if (scope.timoutId) {
                        $timeout.cancel(scope.timoutId);
                    }
                    calculate();
                    tick();
                };

                attrs.$observe('countTo', function (val) {
                    if (val) {
                        start();
                    }
                });

                attrs.$observe('value', function (val) {
                    start();
                });

                return true;
            }
        };
    }
        
})();
