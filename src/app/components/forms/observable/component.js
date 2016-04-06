'use strict';

angular.module('CarreEntrySystem')

.directive('observableForm', function() {
  return {
    templateUrl: 'app/components/forms/observable/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Observables, Bioportal, Measurement_types,Auth,toastr) {
      
      $scope.model = $scope.model || {};

      //get measurement types
      Measurement_types.get().then(function(res) {
        $scope.measurement_types = res.data.map(function(obj) {
            return {
              value: obj.id,
              label: obj.has_measurement_type_name_label
            };
          });
      });
      
      //Bioportal stuff
      $scope.bioportalAutocompleteResults = [];
      $scope.bioportalAutocomplete = function(term) {
        if (term.length < 2) return false;
        $scope.loadingElementIdentifier = true;
        var options={
          ontologies:"CMO"
        };
        Bioportal.fetch(term,options,"no cui").then(function(res) {
          $scope.bioportalAutocompleteResults = res;
          $scope.loadingElementIdentifier = false;
        });
      };
      $scope.addExternalType=function(item){
        return { value:"http://carre.kmi.open.ac.uk/external_observable_type/CMO_"+item.replace(" ","_").toUpperCase(), label:item }
      }

      //Observable types
      $scope.types = [{
        label: "Personal",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#observable_type_personal"
      }, {
        label: "Clinical",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#observable_type_clinical"
      }, {
        label: "Other",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#observable_type_other"
      }];

      
      //Save to RDF method
      $scope.saveModel=function(){
        Observables.save($scope.model,$scope.observable).then(function(res){
          //success
          console.log('Observable saved',res);
          $scope.$emit('observable:save');
          toastr.success('<b>'+$scope.observable.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Observable saved</h4>');
        });
      };
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('observable:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.observable = {
          name: $scope.model.has_observable_name[0],
          type: $scope.model.has_observable_type[0],
          measurement_type: $scope.model.has_observable_measurement_type[0],
          identifier: $scope.model.has_external_type?$scope.model.has_external_type[0]:{}
        };
        
        //init Bioportal Fetch
        $scope.bioportalAutocomplete($scope.observable.identifier);


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.observable = {
          name: "",
          type: "",
          measurement_type: "",
          identifier:""
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.observable);

    }
  };
});
