'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphNetwork', function() {
    return {
      templateUrl: 'app/components/graph-network-d3/template.html',
      restrict: 'E',
      scope: {
        'limitNewConnections':'@',
        'height': '@',
        'riskid': '='
      },
      controller: function($scope, $timeout, toastr, $location, CONFIG, GRAPH ,$state,SweetAlert,$q) {
      
  var vm = $scope;
        vm.loading=false;
        //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections||4;
        vm.minConnections = 10;
        vm.height = vm.height || 600;
        vm.customHeight=0;
        var network;
        vm.options = {
          showRiskEvidences:false,
          onlyCore: false
        }
        $timeout(function() {
            vm.selectedId = 'RL_2'
        },3000);
        $scope.$watch('options',function(n,o){
          if(n.showRiskEvidences!==o.showRiskEvidences) {
            console.debug('ShowRiskEvidences')
          } else if(n.onlyCore!==o.onlyCore) {
            console.debug('onlyCore')
          }
          if(n.showRiskEvidences!==o.showRiskEvidences||n.onlyCore!==o.onlyCore)
            vm.loading=$q.defer();
            $timeout(function(){
              vm.loading=vm.init(vm.riskid); 
            },250);
        });
        
        
        vm.addSize=function(){
          console.debug("size++")
        }
        
        vm.removeSize=function(){
          console.debug("size--")
        }
        
        
        
        vm.init=function(id) {
          if(!id) id = vm.riskid;
          vm.loading=GRAPH.network(id,!vm.options.showRiskEvidences?'risk_factor':null).then(function(data){ 
            
            //set initial nodes and edges
            vm.nodesArr=id?data.nodes.map(function(obj){
                var obj_pos=-1;
                //handle colors
                if(id instanceof Array) obj_pos=id.indexOf(obj.id);
                else obj_pos=id.substring(id.lastIndexOf("/")+1)===obj.id.substring(obj.id.lastIndexOf("/")+1)?0:-1;
                if(obj_pos>=0) obj.color=CONFIG.COLORS[obj_pos];
                
                return obj;
              }):data.nodes.filter(function(obj){ return obj.connections>vm.minConnections;});
              
            //filter edges
            vm.edgesArr=data.edges.filter(function(edge){
              
              
              var from=false;
              var to=false;
              for (var i=0,len=vm.nodesArr.length;i<len;i++){
                if(vm.nodesArr[i].id===edge.from) from=true;
                if(vm.nodesArr[i].id===edge.to) to=true;
              }
              return from&&to;
            });
            
            //init network after 50ms delay
            $timeout(function(){
              
            
              if(vm.options.onlyCore && vm.riskid instanceof Array && vm.riskid.length>1) {
                  var nodeIds=[];
                  vm.loading=vm.startNetwork({
                    nodes:vm.nodesArr.filter(function(node){
                    if(network.getConnectedEdges(node.id).length>1 || node.color ){
                      if(nodeIds.indexOf(node.id)===-1) nodeIds.push(node.id);
                      return true;
                    } else return false;
                  }),
                    edges:vm.edgesArr.filter(function(edge){
                    return nodeIds.indexOf(edge.from)>=0 && nodeIds.indexOf(edge.to)>=0;
                  })
                    
                  });
              } else vm.startNetwork();
              
              
            },50);
            
          }); 
        }
        
        //start the initialization
        vm.init(vm.riskid);
        
        
        vm.showRiskFactor=function(id,label){
          //implement a basic confirm popup
          SweetAlert.swal({
              title: "Show the Risk factor?",
              text: "This will redirect you to the \""+label+"\" risk factor's detail page.",
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#2E8B57",
              confirmButtonText: "Yes, show me!",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                $state.go("main.risk_factors.view",{id:id});
              }
            });
          
        };
        
        vm.showRiskElement=function(id,label){
          //implement a basic confirm popup
          SweetAlert.swal({
              title: "Show the Risk element?",
              text: "This will redirect you to the \""+label+"\" risk element's detail page.",
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#2E8B57",
              confirmButtonText: "Yes, show me!",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                $state.go("main.risk_elements.view",{id:id});
              }
            });
          
        };
        
        /* Graph manipulations */
        vm.addNodeRelations = function (id) {
          id = id || vm.selectedId;
          vm.loading=GRAPH.network(id,!vm.options.showRiskEvidences?'risk_factor':null).then(function(data){
            var limit=vm.limitNewConnections;
            var nodes={};
            data.nodes.forEach(function(node){
              nodes[node.id]=node;
            });
            data.edges.forEach(function(edge){
              if(!vm.edges._data[edge.id]&&limit>0) {
                if(!vm.nodes._data[edge.from]) vm.nodes.add(nodes[edge.from]);
                if(!vm.nodes._data[edge.to]) vm.nodes.add(nodes[edge.to]);
                vm.edges.add(edge);
                limit--;
              }
            });
          });
        };
        
        vm.selectElement = function(id){
          if(!id) $timeout(function(){vm.showDetails=false; vm.selectedId = false; },0);
          else {
            if(id.indexOf('/')!==-1) id = id.substr(id.lastIndexOf('/')+1);
            $timeout(function(){vm.selectedId = id; },0);
            if(vm.showDetails) { //reload element hack
              $timeout(function(){vm.showDetails=false; },0);
              $timeout(function(){vm.showDetails = true;},100);
            }
          }
          
        };
        vm.deleteSelected = function(id){
          var node=id||network.getSelectedNodes()[0];
          if(!node) return false; 
          var nodeData={
            nodes:[node],
            edges:network.getConnectedEdges(node)
          }
          vm.removeOrphan(nodeData);
        }
        
        vm.goToSelected = function(){
          var nodes=network.getSelectedNodes();
          var edges=network.getSelectedEdges();
          
          if(nodes.length===1) {
             //then it is a risk element
             var rl_id=nodes[0].substring(nodes[0].lastIndexOf("/")+1);
             var rl_label=vm.nodes._data[nodes[0]].label;
             vm.showRiskElement(rl_id,rl_label);
          } else if (edges.length===1){
            //then it is a risk factor
            var edge=vm.edges._data[edges[0]];
            var rf_id=edges[0].substring(edges[0].lastIndexOf("/")+1);
            var rf_label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
            vm.showRiskFactor(rf_id,rf_label);
          } else return false;
        }
        
        vm.removeOrphan = function(data){
          data.nodes.forEach(function(node){vm.nodes.remove(node);});
          data.edges.forEach(function(edge){ vm.edges.remove(edge);});
          var nodes=Object.keys(vm.nodes._data);
          nodes.forEach(function(node){
            var edges=network.getConnectedEdges(node);
            if(edges.length<=0) {
              vm.nodes.remove(node);
            }
          });
        };
    
        
   
        
        // EVENTS===============
        
/*            
            //register events
            network.on("doubleClick", function (params) {
                if(params.nodes.length===1) vm.addNodeRelations(params.nodes[0]);
                else if(params.edges.length===1) {
                  
                  // vm.addRiskEvidences(vm.edges._data[params.edges[0]]);
                  
                  // do something with the edge
                  var edge=vm.edges._data[params.edges[0]];
                  var rf_id=params.edges[0].substring(params.edges[0].lastIndexOf("/")+1);
                  var rf_label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
                  vm.showRiskFactor(rf_id,rf_label);
                }
            });
            //left click
            network.on("click", function (params) {
              var deleteButton=angular.element('#explore_deleteButton');
              var goButton=angular.element('#explore_goButton');
              if(params.nodes.length===1) {
                vm.selectElement(params.nodes[0]);
                deleteButton.css("display","inline");
                goButton.css("display","inline"); 
              } else if(params.edges.length===1) {
                goButton.css("display","inline"); 
                vm.selectElement(params.edges[0]);
              } else {
                goButton.css("display","none"); 
                deleteButton.css("display","none"); 
              }
            });
            //right click
            network.on("oncontext", function (params) {
              var nodeId=network.getNodeAt(params.pointer.DOM);
              if(nodeId) {
                params.event.preventDefault();
                vm.deleteSelected(nodeId);
              }
            });
            */
            

vm.startNetwork = function(externalData) {
            
        externalData = externalData || {}
        vm.customHeight=0;
        var  nodes = externalData.nodes||vm.nodesArr;
        var  links = externalData.edges||vm.edgesArr;
        angular.element('#network svg').remove();
        visualize('network',window.width-200,500,
        {
          "nodes":nodes,
          "links":links.map(function(l){
                    l.source = FindnodeIndex(nodes,l.source,"id");
                    l.target = FindnodeIndex(nodes,l.target,"id");
                    l.value = l.ratio;
                    return l;
                  })
        });
};

    function visualize(id, w, h, data) {
        var color = d3.scale.category20b();
        var vis = d3.select("#" + id).append("svg").attr("id", "graph").attr("width", w).attr("height", h)
            .attr("style", "pointer-events:fill;");

        var force = self.force = d3.layout.force().nodes(data.nodes).links(data.links).gravity(.2).distance(180)
            .charge(-500).size([ w, h ]).start();

        // end-of-line arrow
        vis.append("svg:defs").selectAll("marker").data([ "end-marker" ]) // link types if needed
            .enter()
            .append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10")
            .attr("refX", 30).attr("refY", 0).attr("markerWidth", 2).attr("markerHeight", 2)
            .attr("class", "marker").attr("orient","auto")
            .append("svg:path").attr("d", "M0,-5L10,0L0,5")
            .style("fill","#aaaaaa")
            .style("stroke","#aaaaaa");
                
                
        var radius=20
        var node = vis.selectAll("g.node").data(data.nodes).enter().append("circle").attr("class", "node").attr(
                "r", radius).style("fill",function (d) {
                return d.color||'#aaaaaa';
            }).style("stroke-width",function (d) {
                return d["selected"] ? 2 : 2;
            }).style("stroke",function (d) {
                var sel = d["selected"];
                return sel ? "red" /* was d3.rgb(color2(hash(sel) % 20)).brighter() */ : "white";
            }).call(force.drag);


        var link = vis.selectAll("line.link").data(data.links).enter().append("svg:line").attr("class", "link")
            .attr("marker-end", function (d) {
                return "url(#" + "end-marker" + ")";
            }) // was d.type
            .style("stroke",function (d) {
                var sel = d["selected"];
                return sel ? "red" : "#aaaaaa";
            }).style("stroke-width",function (d) {
                return d["selected"] ? 5 : 5;
            }).attr("x1",function (d) {
                return d.source.x;
            }).attr("y1",function (d) {
                return d.source.y;
            }).attr("x2",function (d) {
                return d.target.x;
            }).attr("y2", function (d) {
                return d.target.y;
            });
            
            
        //node text
        node.append("title").text(function (d) {
            return d.label;
        });
        var text = vis.append("svg:g").selectAll("g").data(force.nodes()).enter().append("svg:g");
        // A copy of the text with a thick white stroke for legibility.
        text.append("svg:text").attr("x", 28).attr("y",0).attr("class", "text shadow").text(function (d) {
            return d.label;
        });
        text.append("svg:text").attr("x", 28).attr("y", 0).attr("class", "text").text(function (d) {
            return d.label;
        });
        
        
        //link text
        var path_text = vis.append("svg:g").selectAll("g").data(force.links()).enter().append("svg:g");
        path_text.append("svg:text").attr("class", "path-text shadow").text(function (d) {
            return d.label;
        });
        path_text.append("svg:text").attr("class", "path-text").text(function (d) {
            return d.label;
        });
        

        force.on("tick", function () {
            link.attr("x1",function (d) {
                return d.source.x;
            }).attr("y1",function (d) {
                    return d.source.y;
                }).attr("x2",function (d) {
                    return d.target.x;
                }).attr("y2", function (d) {
                    return d.target.y;
                });

            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            
            path_text.attr("transform", function (d) {
                var dx = ( d.target.x - d.source.x ), dy = ( d.target.y - d.source.y );
                var dr = Math.sqrt(dx * dx + dy * dy);
                if (dr == 0) dr = 0.1;
                var sinus = dy / dr;
                var cosinus = dx / dr;
                var l = d.label.length * 6;
                var offset = ( 1 - ( l / dr ) ) / 2;
                var x = ( d.source.x + dx * offset );
                var y = ( d.source.y + dy * offset );
                return "translate(" + x + "," + y + ") matrix(" + cosinus + ", " + sinus + ", " + -sinus + ", " + cosinus
                    + ", 0 , 0)";
            });

        });
    }
    
        //end of controller
      }
    
    };
  });
