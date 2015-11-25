angular.module('CarreEntrySystem').service('Risk_elements', function($http, CARRE, CONFIG) {

  this.exports = {
    'get': getRisk_elements,
    'insert' :insertRisk_element
  };

  function getRisk_elements(ArrayOfIDs) {
    return CARRE.instances('risk_element', ArrayOfIDs);
  }

  function insertRisk_element(oldElem,newElem,user){
    console.info("SUBMIT FORM: ",oldElem,newElem,user);
    /*
    RDF Template
    
       "node":"http://carre.kmi.open.ac.uk/risk_elements/RL_3",
       "type":"http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element",
       "has_author":"https://carre.kmi.open.ac.uk/users/KalliopiPafili",
       "has_reviewer":"https://carre.kmi.open.ac.uk/users/GintareJuozalenaite",
       "has_risk_element_identifier":"http://umls.nlm.nih.gov/sab/mth/cui/C0001783",
       "has_risk_element_modifiable_status":"no",
       "has_risk_element_name":"age",
       "has_risk_element_observable":"http://carre.kmi.open.ac.uk/observables/OB_7",
       "has_risk_element_type":"http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_demographic",
       "has_risk_element_index":"3"
    
    Json Template
        "observables": [
          "http://carre.kmi.open.ac.uk/observables/OB_7"
        ],
        "type": "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_demographic",
        "name": "age",
        "identifier": "C0001783",
        "modifiable_status": "no"
        
    */
    /*Create query*/
    // INSERT [ INTO <uri> ]* { template } [ WHERE { pattern } ]
    var query="INSERT INTO "+CONFIG.CARRE_DEFAULT_GRAPH+" { \n\
                                                            \n\
                                                            \n\
                                                            \n\
    } WHERE {\n\
            \n\
            \n\
            \n\
    }";
  }
  
  return this.exports;

});