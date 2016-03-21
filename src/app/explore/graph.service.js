angular.module('CarreEntrySystem').service('GRAPH', function(CONFIG,CARRE,RdfFormatter) {
    
  this.exports = {
    'network': getNetworkData
  };
  
  
  //Returns a Tree ( RF: {RL_source,RL_target,RV:{OB:[],.. })
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
            
    return CARRE.selectQuery(query,'raw',(CONFIG.USECACHE?cache_key:null)).then(function(res) {

      var formattedData=res.data.reduce(function(init,cur){
        var val=init.valueProp;
        //construct risk factor element tree
        var rf_index=cur.risk_factor[val].substring(cur.risk_factor[val].lastIndexOf('/')+1);
        var rf={
          rf_id:cur.risk_factor[val],
          rf_type:cur.has_risk_factor_association_type[val],
          rf_source_id:cur.has_risk_factor_source[val],
          rf_source_label:cur.has_risk_source_element_name[val],
          rf_target_id:cur.has_risk_factor_target[val],
          rf_target_label:cur.has_risk_target_element_name[val],
          rf_evidences:[]
        };
        var rv_index=rf_index+'_'+cur.has_risk_evidence[val].substring(cur.has_risk_evidence[val].lastIndexOf('/')+1);
        var rv={
          rv_id:cur.has_risk_evidence[val],
          rv_observable_condition:cur.has_observable_condition_text[val],
          rv_ratio_value:cur.has_risk_evidence_ratio_value[val],
          rv_observables:[]
        };
        var ob={
          ob_id:cur.has_risk_evidence_observable[val],
          ob_label:cur.has_risk_evidence_observable_name[val]
        };
        var rf_pos=init.index[rf_index];
        var rv_pos=init.index[rv_index];
        
        if (!rf_pos && rf_pos!==0) {
          rv.rv_observables.push(ob);
          rf.rf_evidences.push(rv);
          init.data.push(rf);
          init.index[rv_index] = 0;
          init.index[rf_index] = init.data.indexOf(rf);
        }
        else if (!rv_pos && rv_pos!==0) {
          rv.rv_observables.push(ob);
          init.data[rf_pos].rf_evidences.push(rv);
          init.index[rv_index] = init.data[rf_pos].rf_evidences.indexOf(rv);
        }
        else {
          init.data[rf_pos].rf_evidences[rv_pos].rv_observables.push(ob);
        }
        
        return init;
          
      },{data:[],index:{},valueProp:'value'});
      
      console.log("Graph Formatter: ",formattedData);
      
      var graphData = {
        nodes:[],
        edges:[]
      };
        
      var tmp_nodes=[];
      formattedData.data.forEach(function(rf) {
      
        var source = {
          label: rf.rf_source_label,
          id: rf.rf_source_id,
          value:1
        };

        var target = {
          label: rf.rf_target_label,
          id: rf.rf_target_id,
          value:1
        };

        var relation = {
          label: RdfFormatter.translate(rf.rf_type),
          id: rf.rf_id,
          ratio:rf.rf_evidences.reduce(function(prev,cur){return prev+Number(cur.rv_ratio_value);},0),
          evidences:rf.rf_evidences
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
        graphData.edges.push({id:relation.id, from:source.id, label:relation.label, to:target.id, value:relation.ratio, evidences:relation.evidences});

      });
      
      console.log(graphData);
      return graphData;

    });
  }


    return this.exports;
});