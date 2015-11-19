/* global angular */
(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .filter('trustAsResourceUrl', trustResourceFilter);


    /** @ngInject */
    function trustResourceFilter($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }
})();