(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_reviewsSingleController', risk_reviewsSingleController);

  /** @ngInject */
  function risk_reviewsSingleController($scope, Medical_experts, Bioportal, Risk_reviews,toastr,Auth) {
      
      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];

      //get observables
      Medical_experts.get().then(function(res) {
        //auto select initial
        var selected=[];
        $scope.medical_experts = res.data.map(function(ob) {
            var obj={
              value: ob.id,
              label: ob.has_observable_name_label
            };
            if($scope.model.id && $scope.model.has_risk_review_observable) {
              if($scope.model.has_risk_review_observable.indexOf(ob.id)>=0) selected.push(obj.value);
            }
            return obj;
          });
        $scope.risk_review.is_assigned_to=selected;
      });

      //get risk elements
      Risk_reviews.get().then(function(res) {
        //auto select initial
        var selected=[];
        $scope.risk_reviews = res.data.map(function(rl) {
            var obj={
              value: rl.id,
              label: rl.has_risk_review_name_label
            };
            if($scope.model.id && $scope.model.includes_risk_review) {
              if($scope.model.includes_risk_review.indexOf(rl.id)>=0) selected.push(obj.value);
            }
            return obj;
          });
          $scope.risk_review.risk_reviews=selected;
      });

      //risk element types
      $scope.review_statuses = [{
        label: "Accepted",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_review_status_accepted"
      }, {
        label: "Rejected",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_review_status_rejected"
      }, {
        label: "Pending",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_review_status_pending"
      }, {
        label: "Incoming",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_review_status_incoming"
      }, {
        label: "Completed",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_review_status_completed"
      }];

      //Bioportal stuff
      $scope.bioportalAutocomplete = function(term) {
        // var options = { };
        if (term.length < 2) return false;
        $scope.loadingElementIdentifier = true;
        Bioportal.fetch(term).then(function(res) {
          $scope.bioportalAutocompleteResults = res;
          $scope.loadingElementIdentifier = false;
        });
      };
      
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


      if ($scope.model.id) {

        /************** Review or Accept/Reject Mode **************/
        console.info('---Review or Accept/Reject Mode---');
        // Auth.getUser().then(function(res){
          
        //   if($scope.model.is_assigned_to[0] === res.data.userGraph)
        // })

        //Init Form object
        $scope.risk_review = {
          status: $scope.model.review_status[0],
          notes: $scope.model.has_review_notes[0],
          json: $scope.model.has_review_json[0],
          review_date: $scope.model
        };


        //init Bioportal Fetch
        $scope.bioportalAutocomplete($scope.risk_review.identifier);


      }
      else {

        /************** Assign Mode **************/
        console.info('---Assign Mode---');

        //Init Form object
        $scope.risk_review = {
          is_for_element: "",
          is_assigned_to: "",
          status:"pending",
          assign_date: new Date()
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_review);

  }

})();
