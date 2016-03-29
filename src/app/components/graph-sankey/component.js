'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphSankeyRisk', function() {
    return {
      templateUrl: 'app/components/graph-sankey/template.html',
      restrict: 'E',
      scope: {
        'limitNewConnections': '@',
        'height': '@',
        'riskid': '='
      },
      controller: function($scope, $timeout, toastr, CARRE, $location, CONFIG, GRAPH, content,$q) {

        var vm = $scope;
        vm.loading = false;
        var containerID = "sankey";
          //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections || 4;
        vm.minConnections = 6;
        vm.height = vm.height || 600;
        vm.options = {
          showRiskEvidences:true
        }
        
        
        vm.toggleRiskEvidences=function(){
            vm.loading=$q.defer();
            $timeout(function(){
              vm.options.showRiskEvidences = !vm.options.showRiskEvidences;
              vm.loading=vm.init(vm.riskid); 
              
            },0);
        };
        
        
        /* Graph manipulations */
        vm.addNodeRelations = function (id) {
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
          var id,label;
          
          if(nodes.length===1) {
             //then it is a risk element
            id=nodes[0].substring(nodes[0].lastIndexOf("/")+1);
            label=vm.nodes._data[nodes[0]].label;
          
          } else if (edges.length===1){
              var edge=vm.edges._data[edges[0]];
              id=edges[0].substring(edges[0].lastIndexOf("/")+1);
              label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
              
          } else return false;
          content.goTo(id,label);
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
        
        vm.init =function (id){
          vm.loading = GRAPH.network(id,!vm.options.showRiskEvidences?'risk_factor':null).then(function(data) {

            //set initial nodes and edges
            vm.nodesArr = id ? data.nodes.map(function(obj) {
              var obj_pos = -1;
              //handle colors
              if (id instanceof Array) obj_pos = id.indexOf(obj.id);
              else obj_pos = id.substring(id.lastIndexOf("/") + 1) === obj.id.substring(obj.id.lastIndexOf("/") + 1) ? 0 : -1;
              if (obj_pos >= 0) obj.color = CONFIG.COLORS[obj_pos];

              return obj;
            }) : data.nodes.filter(function(obj) {
              return obj.connections > vm.minConnections;
            });

            //filter edges
            vm.edgesArr = data.edges.filter(function(edge) {
              var from = false;
              var to = false;
              for (var i = 0, len = vm.nodesArr.length; i < len; i++) {
                if (vm.nodesArr[i].id === edge.from) from = true;
                if (vm.nodesArr[i].id === edge.to) to = true;
              }
              return from && to;
            });
            //init chart after 50ms delay
            $timeout(function() {
              vm.renderSankey();
            }, 50);

          });
        };
        
        //start the initialization
        vm.init(vm.riskid);

        
        $(window).resize(function(){
          $('#'+containerID+' svg').remove();
          vm.renderSankey();
        });
        
        function chartCss(attr){
          var elem=document.getElementById(containerID);
          if(elem) return Number(getComputedStyle(elem, null).getPropertyValue(attr).replace('px',''));
          else return null;
        }


        vm.renderSankey = function() {
          // Some setup stuff.
          var node_index = {};
          var graph = {
            nodes: vm.nodesArr.map(function(obj, index) {
              node_index[obj.id] = {
                index: index,
                // value: obj.value
              };
              obj.name = obj.label;
              return obj;
            }),
            links: vm.edgesArr.map(function(obj) {
              obj.value = Number(obj.ratio)||1;
              obj.source = node_index[obj.from].index;
              obj.target = node_index[obj.to].index;
              return obj;
            })
          };
          
          var calculated_height = Math.log(graph.links.length)*250;
          console.debug("Calculated Height",calculated_height);
          
            var margin = {top: 10, right: 10, bottom: 10, left: 10},
                width = chartCss('width') - margin.left - margin.right,
                height = (calculated_height>vm.height?calculated_height:vm.height) - margin.top - margin.bottom;
                
            var viewBox = '0 0 '+(angular.element(window).width()+40)+' '+(height+20);
            
            var formatNumber = d3.format(",.0f"), 
                format = function(d) { return formatNumber(d); },
                d3colors = d3.scale.category20b();
            	
            // append the svg canvas to the page
            angular.element("#"+containerID+" svg").remove();
            var svg = d3.select("#"+containerID).append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox",viewBox)
              .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");
            
            	   
            // Set the sankey diagram properties
            var sankey = d3.sankey()
                .nodeWidth(20)
                .nodePadding(12)
                .size([width, height]);
            var path = sankey.link();
            sankey
              .nodes(graph.nodes)
              .links(graph.links)
              .layout(32);

            // add in the links
            var link = svg.append("g").selectAll(".link")
              .data(graph.links)
              .enter().append("path")
              .attr("class", "link")
              .attr("d", path)
              .style("stroke", function(d, i) {
                return vm.riskid?(d.source.color||'#aaaaaa'):d3colors(node_index[d.source.id].index);
              })
              .style("stroke-width", function(d) {
                return Math.max(2, d.dy)-1; //add white seperator
              })
              .sort(function(a, b) {
                return b.dy - a.dy;
              });
              
              link.append("title")
              .append("title")
                .text(function(d) {
                return d.source.name +" "
                + d.label +" "+ d.target.name + (vm.options.showRiskEvidences?" with risk ratio "+d.ratio:"");
              });
              
            // add in the nodes
            var node = svg.append("g").selectAll(".node")
              .data(graph.nodes)
              .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
              })
              .call(d3.behavior.drag()
                .origin(function(d) {
                  return d;
                })
                .on("dragstart", function() {
                  this.parentNode.appendChild(this);
                })
                .on("dragend", function() {
                    // sankey.relayout();
                })
                .on("drag", dragmove));

            // add the rectangles for the nodes
            node.append("rect")
              .attr("height", function(d) {
                return d.dy;
              })
              .attr("width", sankey.nodeWidth())
              .style("fill", function(d, i) {
                return vm.riskid?(d.color||'#aaaaaa'):d3colors(i) // = color(i);
              })
              // .style("stroke", function(d) {
              //   return d3.rgb('#aaaaaa');
              // })
              .attr('data-title', function(d) {
                return d.name// + "\n" + format(d.value);
              });


            // add in the title for the nodes
            node.append("text")
              .attr("x", -6)
              .attr("y", function(d) {
                return d.dy / 2;
              })
              .attr("dy", "0.36em")
              .attr("text-anchor", "end")
              .attr("transform", null)
              .text(function(d) {
                return d.name.charAt(0).toUpperCase() + d.name.slice(1);;
              })
              .filter(function(d) {
                return d.x < width / 2;
              })
              .attr("x", 6 + sankey.nodeWidth())
              .attr("text-anchor", "start");

            // the function for moving the nodes
            function dragmove(d) {
              d3.select(this).attr("transform",
                "translate(" + d.x + "," + (
                  d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
              link.attr("d", path);
            }
            
        }

        //end of controller
      }

    };
  });
