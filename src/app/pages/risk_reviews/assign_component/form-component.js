'use strict';

angular.module('CarreEntrySystem')

.directive('assignReviewForm', function() {
  return {
    templateUrl: 'app/pages/risk_reviews/assign_component/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'elemId': '='
    },
    controller: function($scope, Medical_experts, Risk_reviews,Auth,toastr) {
      
      $scope.model = {};

      //get Medical experts
      Medical_experts.get().then(function(res) {
        console.log("MEDICAL Experts",res.data);
        $scope.medical_experts = res.data.map(function(md){
          return {
            value:md.id,
            label:md.has_firstname_label+" "+
              md.has_lastname_label+", "+
              md.has_team_name_label+", "+
              md.has_medical_specialty_label
          };
        });
      });

      
      //Save to RDF method
      $scope.saveModel=function(){
        Risk_reviews.save($scope.model,$scope.risk_review).then(function(res){
          //success
          console.log('Risk Element saved',res);
          
          $scope.$emit('risk_review:save');
          toastr.success('<b>'+$scope.risk_review.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Risk element saved</h4>');

        });
      };
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('risk_review:cancel');
      };


      //Init Form object
      $scope.risk_review = {
        is_assigned_to: "",
        is_for_element: $scope.elemId,
        assign_date: new Date(),
        review_status: "pending"
      };



      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_review);

    }
  };
});
