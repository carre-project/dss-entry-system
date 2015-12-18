angular.module('CarreEntrySystem').service('Observables', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getObservables,
    'insert': insertObservable
  };
  
  function getObservables(ArrayOfIDs) {
    return CARRE.instances('observable',ArrayOfIDs);
  }

  function insertObservable(oldElem, newElem, user) {
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {

      /* Update query */

      deleteQuery = "DELETE DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
        <" + oldElem.id + "> risk:has_observable_name \"" + oldElem.has_observable_name[0] + "\"^^xsd:string; \n\
                              risk:has_observable_type <" + oldElem.has_observable_type[0] + ">; \n\
                              risk:has_observable_measurement_type <" + oldElem.has_observable_measurement_type[0] + ">. }} \n";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
        <" + oldElem.id + "> risk:has_observable_name \"" + oldElem.has_observable_name[0] + "\"^^xsd:string; \n\
                              risk:has_observable_type <" + newElem.type + ">; \n\
                              risk:has_observable_measurement_type <" + newElem.measurement_type + ">. }} \n";
      

      /*----------*/

      updateQuery = deleteQuery + insertQuery;
      
      console.info('-----updateQuery------');
      return CARRE.query(updateQuery);
    }
    else {
      /*Insert query*/


      insertQuery = "INSERT { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
        ?newid  risk:has_observable_name \"" + oldElem.has_observable_name[0] + "\"^^xsd:string; \n\
                risk:has_observable_type <" + newElem.type + ">; \n\
                risk:has_observable_measurement_type <" + newElem.measurement_type + ">; \n\
                risk:has_author <" + user + ">; \n";
                
          //add type and close query
          insertQuery += "a risk:observable . } } WHERE \n\
      { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
          { { \n\
              SELECT (COUNT(DISTINCT ?elems) AS ?oldindex) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
              WHERE { \n\
               ?elems a risk:observable . \n\
              } \n\
            } \n\
            BIND (IRI(CONCAT(OB:, \"RF_\", ?oldindex+1)) AS ?newid) \n\
          } }";
    
    
          console.info('-----insertQuery------');
          return CARRE.query(insertQuery);
    }

  }

  return this.exports;
  
});