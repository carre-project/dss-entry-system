angular.module('CarreEntrySystem').service('GRAPH', function(CONFIG,CARRE) {
    
  this.exports = {
    'networkData': getNetworkData
  };
  
  function getNetworkData(idFilter){
    var FilterString="";
    var cache_key="";
    var filters=[];
    if(idFilter){
      if(!(idFilter instanceof Array)) {
        //convert to array;
        idFilter = [idFilter];
      } //else it is array
      
      idFilter.forEach(function(sid,index){
        //id fix
        var prefix = "";
        if (sid.indexOf("http") === -1) {
          cache_key=cache_key+"_"+sid;
          prefix = sid.split("_")[0];
          sid = prefix + ":" + sid;
        } else {
          cache_key=cache_key+"_"+sid.substring(sid.lastIndexOf("/")+1);
          sid = "<" + sid + ">";
        }
        
        //now filter depending on id
        if(sid.indexOf("RL")>=0){
          filters.push("?has_risk_factor_source="+sid+"||?has_risk_factor_target="+sid);
        } else if(sid.indexOf("RF")>=0) {
          filters.push("?risk_factor="+sid);
        } else if(sid.indexOf("RV")>=0) {
          filters.push("?has_risk_evidence="+sid);
        } else if(sid.indexOf("OB")>=0) {
          filters.push("?has_risk_evidence_observable="+sid);
        }
      });
        
      FilterString="FILTER ("+filters.join("||")+")";
      
      //if ids>1 no cache else add prefix
      // if(id.length!==1) cache_key=null;
      cache_key="risk_associations_for"+cache_key;
      
    } else cache_key="risk_associations_for_all";
    
     var query = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
            WHERE { \n\
            ?risk_factor a risk:risk_factor. \n\
            ?risk_factor risk:has_risk_factor_association_type ?has_risk_factor_association_type. \n\
            ?risk_factor risk:has_risk_factor_source ?has_risk_factor_source. \n\
            ?risk_factor risk:has_risk_factor_target ?has_risk_factor_target. \n\
            ?has_risk_factor_source risk:has_risk_element_name ?has_risk_source_element_name. \n\
            ?has_risk_factor_target risk:has_risk_element_name ?has_risk_target_element_name. \n\
            ?has_risk_evidence a risk:risk_evidence; \n\
            risk:has_risk_factor ?risk_factor; \n\
            risk:has_risk_evidence_ratio_value ?has_risk_evidence_ratio_value; \n\
            risk:has_observable_condition_text ?has_observable_condition_text; \n\
            risk:has_risk_evidence_observable ?has_risk_evidence_observable. \n\
            ?has_risk_evidence_observable risk:has_observable_name ?has_risk_evidence_observable_name. \n\
            "+ FilterString+" }";
            
    return CARRE.selectQuery(query,'raw',(CONFIG.ENV!=='DEV'?cache_key:null)).then(function(res) {
      console.log("Graph service: ",res.data);
      var graphData = {
        nodes:[],
        edges:[]
      };
        
      var tmp_nodes=[];
      res.data.forEach(function(rf) {
      
        var source = {
          label: rf.has_risk_factor_source_label,
          id: rf.has_risk_factor_source[0],
          value:1
        };

        var target = {
          label: rf.has_risk_factor_target_label,
          id: rf.has_risk_factor_target[0],
          value:1
        };

        var relation = {
          label: rf.has_risk_factor_association_type_label,
          id: rf.id
        };

        //add the nodes
        var source_index=tmp_nodes.indexOf(source.id);
        if(source_index===-1) {
          tmp_nodes.push(source.id);
          graphData.nodes.push(source);
        } else {
          graphData.nodes[source_index].value++;
        }
        var target_index=tmp_nodes.indexOf(target.id);
        if(target_index===-1) {
          tmp_nodes.push(target.id);
          graphData.nodes.push(target);
        } else {
          graphData.nodes[target_index].value++;
        }
        
        //add the edges
        graphData.edges.push({id:relation.id, from:source.id, label:relation.label, to:target.id});

      });
      
      return graphData;

    });
  }
      
    return this.exports;
});