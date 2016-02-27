angular.module('CarreEntrySystem').service('Measurement_types', function($http, CARRE, CONFIG, QUERY) {

  this.exports={
    'get': getMeasurement_types,
    'save': saveMeasurement_type
  };
  
  function getMeasurement_types(ArrayOfIDs) {
    return CARRE.instances('measurement_type',ArrayOfIDs);
  }
  
  function saveMeasurement_type(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    /*
      //Init Form object
        $scope.measurement_type = {
          name: $scope.model.has_measurement_type_name_label,
          unit: $scope.model.has_label_label||"",
          datatype: $scope.model.has_datatype_label
        };
    */
    if(newElem.name.length>0) newObj.has_measurement_type_name = {pre:'risk',value:newElem.name.toString(),type:"string"};
    if(newElem.unit.length>0) newObj.has_label = {pre:'risk',value:newElem.unit.toString(),type:"string"};
    if(newElem.datatype.length>0) newObj.has_datatype = {pre:'risk',value:newElem.datatype.toString(),type:"string"};
    if(newElem.has_enumeration_values.length>0) newObj.has_enumeration_values = {pre:'risk',value:newElem.has_enumeration_values.toString(),type:"string"};
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    /* invalidate measurement_type_all */
    CARRE.invalidateCache('measurement_type_all');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem,newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery,'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj,"measurement_type","ME",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }

  function insertMeasurement_type(oldElem, newElem, user) {
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {

      /* Update query */

      deleteQuery = "DELETE DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_risk_element_name \"" + oldElem.has_risk_element_name[0] + "\"^^xsd:string; \n\
              risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + oldElem.has_risk_element_identifier[0] + ">; \n\
              risk:has_risk_element_type <" + oldElem.has_risk_element_type[0] + ">; \n";
      oldElem.has_risk_element_observable.forEach(function(ob) {
        deleteQuery += "              risk:has_risk_element_observable <" + ob + ">; \n";
      });
      if(oldElem.includes_risk_element) {
        oldElem.includes_risk_element.forEach(function(rl) {
          deleteQuery += "              risk:includes_risk_element <" + rl + ">; \n";
        });
      }
      deleteQuery += "              risk:has_risk_element_modifiable_status \"" + oldElem.has_risk_element_modifiable_status[0] + "\"^^xsd:string . \n }} \n";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_risk_element_name \"" + newElem.name + "\"^^xsd:string; \n\
              risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
              risk:has_risk_element_type <" + newElem.type + ">; \n";
      newElem.observables.forEach(function(ob) {
        insertQuery += "              risk:has_risk_element_observable <" + ob + ">; \n";
      });
      if(newElem.risk_elements) {
        newElem.risk_elements.forEach(function(rl) {
          insertQuery += "              risk:includes_risk_element <" + rl + ">; \n";
        });
      }
      insertQuery += "              risk:has_risk_element_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string . \n }}";
      

      /*----------*/

      updateQuery = deleteQuery + insertQuery;
      
      console.info('-----updateQuery------');
      return CARRE.query(updateQuery);
    }
    else {
      /*Insert query*/


      insertQuery = "INSERT { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
?newid risk:has_risk_element_name \"" + newElem.name + "\"^^xsd:string; \n\
risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
risk:has_risk_element_type <" + newElem.type + ">; \n\
risk:has_risk_element_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string; \n\
risk:has_author <" + user + ">; \n";

      //add observables
      newElem.observables.forEach(function(ob) {
        insertQuery += "risk:has_risk_element_observable <" + ob + ">; \n";
      });
      if (newElem.risk_elements) {
        newElem.risk_elements.forEach(function(rl) {
          insertQuery += "              risk:includes_risk_element <" + rl + ">; \n";
        });
      }
      //add type and close query
      insertQuery += "a risk:risk_element . } } WHERE \n\
  { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
      { { \n\
          SELECT (COUNT(DISTINCT ?elems) AS ?oldindex) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
          WHERE { \n\
           ?elems a risk:risk_element . \n\
          } \n\
        } \n\
        BIND (IRI(CONCAT(RL:, \"RL_\", ?oldindex+1)) AS ?newid) \n\
      } }";


      console.info('-----insertQuery------');
      return CARRE.query(insertQuery);
    }

  }

  return this.exports;
  
});