/* global angular */
(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .filter('trustAsResourceUrl', ['$sce', function($sce) {
            return function(val) {
                return $sce.trustAsResourceUrl(val);
            };
        }]);
})();