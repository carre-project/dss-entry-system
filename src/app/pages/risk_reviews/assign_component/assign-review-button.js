'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
    .directive('assignReviewButton',function() {
    	return {
  		template:
  		  '<button popover-is-open="assign_popover_open" uib-popover-template="\'assignReviewTemplate.html\'" popover-placement="bottom" popover-title="Assign review" type="button" class="btn btn-xs btn-warning"><i class="fa fa-user-plus"></i><span ng-if="label!==\'none\'">{{label||\'Assign Review\'}}</span></button>',
  		restrict:'E',
  		replace:true,
  		scope: {
  		  'label':'@',
  		  'elemId':'='
  		}
  	};
  })
  .run(function($templateCache) {
    $templateCache.put('assignReviewTemplate.html', '<assign-review-form elem-id="elemId"></assign-review-form>');
  });