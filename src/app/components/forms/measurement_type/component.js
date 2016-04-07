'use strict';

angular.module('CarreEntrySystem')

.directive('measurementTypeForm', function() {
  return {
    templateUrl: 'app/components/forms/measurement_type/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Measurement_types, toastr, Bioportal) {


      $scope.model = $scope.model || {};

      //risk element types
      $scope.datatypes = ["float","enum","integer","boolean"];
      
      
      //Bioportal stuff
      $scope.bioportalAutocompleteResults = [];
      $scope.bioportalAutocomplete = function(term) {
        if (term.length < 2) return false;
        $scope.loadingElementIdentifier = true;
        var options={
          ontologies:"UO"
        };
        Bioportal.fetch(term,options,"no cui").then(function(res) {
          $scope.bioportalAutocompleteResults = res;
          $scope.loadingElementIdentifier = false;
        });
      };
      $scope.addExternalType=function(item){
        var formatted = item.replace(/ /g, "_").replace(/[^\w\s]/gi, "").toUpperCase();
        return { value:"http://carre.kmi.open.ac.uk/external_measurement_unit/UO_"+formatted, label:item }
      }
      
      //Save to RDF method
      $scope.saveModel=function(){
        
        //fix measurement type multi values
        if($scope.measurement_type.datatype==='enum'||$scope.measurement_type.datatype==='boolean') {
          $scope.measurement_type.has_enumeration_values = $scope.measurement_type.values.join(';');
          
          console.log($scope.measurement_type.values,$scope.measurement_type.has_enumeration_values);
        } else $scope.measurement_type.has_enumeration_values = "";
        delete $scope.measurement_type.values;
        
        Measurement_types.save($scope.model,$scope.measurement_type).then(function(res){
          //success
          console.log('Measurement type saved',res);
          
          $scope.$emit('measurement_type:save');
          toastr.success('<b>'+$scope.measurement_type.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Measurement type saved</h4>');

        });
      };
      
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('measurement_type:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');

        //Init Form object
        $scope.measurement_type = {
          name: $scope.model.has_measurement_type_name_label,
          unit: $scope.model.has_label_label||"",
          datatype: $scope.model.has_datatype_label,
          identifier: $scope.model.has_external_unit?$scope.model.has_external_unit[0]:{}
        };

        if($scope.model.has_datatype_label==='enum'||$scope.model.has_datatype_label==='boolean') {
          $scope.measurement_type.values=$scope.model.has_enumeration_values_label.split(';');
        }

      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.measurement_type = {
          name: "",
          unit: "",
          datatype: "",
          values: [],
          identifier:{}
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.measurement_type);

    }
  };
});
