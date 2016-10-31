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
        vm.containerId = "sankey";
        
          //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections || 30;
        vm.minConnections = 6;
        vm.height = vm.height || 600;
        vm.customHeight=0;
        
        vm.alwaysOnDetails=true;
        vm.showRiskEvidences=false;
        vm.onlyCore= false;
        
        
        // ratio filter
        vm.ratioFilter = {
          "min":0,
          "max":50
        };
        function ratioFilterFn (a) {
          if(!vm.showRiskEvidences) return true;
          if(a.ratio>=vm.ratioFilter.min&&a.ratio<=vm.ratioFilter.max) return true;
          else {
            // console.debug(a.id+':'+vm.ratioFilter.min+'<'+a.ratio+'<'+vm.ratioFilter.max);
            return false;
          }
        }
        $scope.$watch('ratioFilter.min',function(n,o){
          if(n&&o&&n!==o) vm.renderSankey();
        })
        $scope.$watch('ratioFilter.max',function(n,o){
          if(n&&o&&n!==o) vm.renderSankey();
        })
        
        //resize events
        $(window).resize(function(){ vm.renderSankey(); });
        vm.addSize=function(){
          if(vm.customHeight>=800) return false;
          vm.customHeight+=100;
          $timeout(function() {
            vm.renderSankey();
          });
        };
        vm.removeSize=function(){
          if(vm.customHeight<=-300) return false;
          vm.customHeight-=100;
          $timeout(function() {
            vm.renderSankey();
          });
        };
        
        vm.init =function (id){
          
          id = id || vm.riskid;
          
          vm.loading = GRAPH.network(id,!vm.showRiskEvidences?'risk_factor':null).then(function(data) {

            //set initial nodes and edges
            vm.nodesArr = id ? data.nodes.map(function(obj,index) {
              var obj_pos = -1;
              //handle colors
              if (id instanceof Array ) {
                if(id[0].indexOf("RL_")>=0) obj_pos = id.indexOf(obj.id); else {
                  //if this is not a risk element array
                  obj_pos = index;
                }
              } else {
                if(id[0].indexOf("RL_")>=0) id.substring(id.lastIndexOf("/") + 1) === obj.id.substring(obj.id.lastIndexOf("/") + 1) ? 0 : -1; else {
                  //if this is not a risk element
                  obj_pos = index;
                }
              }                         
              if (obj_pos >= 0) obj.color = CONFIG.COLORS[obj_pos];
              return obj;
            })
            // .filter(function(node){
            //   if(vm.onlyCore) {
            //     return node.color?true:false;
            //   } else return true;
            // }) 
            :data.nodes.filter(function(obj) {
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
            
            $timeout(function() {vm.renderSankey();}, 0);

          });
        };
        
        //start the initialization
        vm.init(vm.riskid);
        
        
        /* Graph manipulations */
        vm.goToSelected = function(){
          var elem = vm.selectedItem.obj||{},
              id = elem.id.substring(elem.id.lastIndexOf("/")+1),
              label,
              type = vm.selectedItem.type;
              
          if(type==='node') label=elem.label;
          else if (type==='link'){
              label=elem.source.label+" "+elem.label+" "+elem.target.label;
          } else return false;
          content.goTo(id,label);
        };
        
        vm.addNodeRelations = function () {
          var id = vm.selectedId;
          vm.loading=GRAPH.network(id,!vm.showRiskEvidences?'risk_factor':null).then(function(data){
            var limit=vm.limitNewConnections;
            var nodes={};
            data.nodes.forEach(function(node){
              nodes[node.id]=node;
            });
            data.edges.forEach(function(edge){
              if(GRAPH.FindIndex(vm.edgesArr,edge.id)===-1&&limit>0) {
                if(GRAPH.FindIndex(vm.nodesArr,edge.from)===-1) vm.nodesArr.push(nodes[edge.from]);
                if(GRAPH.FindIndex(vm.nodesArr,edge.to)===-1) vm.nodesArr.push(nodes[edge.to]);
                vm.edgesArr.push(edge);
                limit--;
              }
            });
            //re-render graph
            $timeout(function() {vm.renderSankey();}, 0);
          });
          
        };
        vm.deleteSelected = function(d){
          if(!vm.selectedItem || vm.selectedItem.type!=='node') return false; 
          var elem = vm.selectedItem.obj||{};
          //remove connected edges
          elem.sourceLinks.forEach(function(link){ vm.edgesArr.splice(GRAPH.FindIndex(vm.edgesArr,link.id), 1); });
          elem.targetLinks.forEach(function(link){ vm.edgesArr.splice(GRAPH.FindIndex(vm.edgesArr,link.id), 1); });
          //remove related nodes
          vm.nodesArr=vm.nodesArr.filter(function(node){ 
            return GRAPH.FindIndex(vm.edgesArr,node.id,'from')+GRAPH.FindIndex(vm.edgesArr,node.id,'to')>=-1;
          });
          if(d) d3.event.preventDefault();
          //re-render graph
          $timeout(function() {vm.renderSankey();}, 0);
        };

        //main graph render function
        vm.renderSankey = function() {
          // Some setup stuff.
          var node_index = {};
          var graph = {};
          
          graph.nodes = vm.nodesArr.map(function(obj, index) {
              node_index[obj.id] = {
                index: index,
                value: obj.value
              };
              obj.name = obj.label;
              return obj;
            });
            
          graph.links = vm.edgesArr
            .map(function(obj) {
              if(vm.showRiskEvidences) obj.ratio_type = GRAPH.ratioType(obj.ratio_type);
              obj.value = Number(obj.ratio)||1;
              obj.source = node_index[obj.from].index;
              obj.target = node_index[obj.to].index;
              return obj;
            });
          
          console.log("Sankey graph data",graph);
          
          var calculated_height = vm.customHeight+Math.log(graph.links.length)*250;
          
            var margin = {top: 10, right: 10, bottom: 10, left: 10},
                width = chartCss('width') - margin.left - margin.right,
                height = (calculated_height>vm.height?calculated_height:vm.height) - margin.top - margin.bottom;
                
            var viewBox = '0 0 '+(angular.element(window).width()+40)+' '+(height+20);
            
            var formatNumber = d3.format(",.0f"), 
                format = function(d) { return formatNumber(d); },
                d3colors = d3.scale.category20b();
            	
            // append the svg canvas to the page
            angular.element("#"+vm.containerId+" svg").remove();
            var svg = d3.select("#"+vm.containerId).append("svg")
              .attr("xmlns","http://www.w3.org/2000/svg")
              .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
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
              .data(graph.links.filter(ratioFilterFn))
              .enter().append("path")
              .attr("id", function(d,i){return idLabel(d.id)})
              .attr("class", "link")
              .attr("d", path)
              .style("stroke", function(d, i) {
                return vm.riskid?(d.source.color||'#aaaaaa'):CONFIG.COLORS[node_index[d.source.id].index];
              })
              .style("stroke-width", function(d) {
                return Math.max(2, d.dy)-1; //add white seperator
              })
              .sort(function(a, b) {
                return b.dy - a.dy;
              });
              
              link.append("title")
                .text(function(d) {
                return d.source.name +" --> "+ d.target.name + (vm.showRiskEvidences
                ?", "+d.ratio_type+" = "+d.ratio
                :", "+d.evidences.length+" evidence(s) "+GRAPH.ratioMinMax(d.evidences));
              });
              
              // var linkText = svg.append("g")
              // .selectAll(".link")
              // .data(graph.links.filter(ratioFilterFn))
              // .enter().append("text").attr("class","linkText")
              // .attr("id", function(d,i){return idLabel(d.id)+"-text"})
              // .append("textPath").attr("class", "textpath")
              // .attr("xlink:href",function(d,i){return "#"+idLabel(d.id)})
              // .text(function(d) {
              //   return d.source.name +" --> "+ d.target.name + (vm.showRiskEvidences?", risk ratio = "+d.ratio:"");
              // })
              
              
              // svg.append("g")
              // .selectAll(".link")
              // .data(graph.links.filter(ratioFilterFn))
              // .enter().append("use")
              // .attr("id", function(d,i){return idLabel(d.id)+"-line"})
              // .attr("xlink:href",function(d,i){return "#"+idLabel(d.id)})
              
              
              
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
                    sankey.relayout();
                })
                .on("drag", dragmove));
              
            // add the rectangles for the nodes
            node.append("rect")
              .attr("height", function(d) {
                return d.dy;
              })
              .attr("width", 
                sankey.nodeWidth()
              )
              .style("stroke", function(d, i) {
                return vm.riskid?(d.color||'#aaaaaa'):CONFIG.COLORS[i]; // = color(i);
              })
              .style("fill", function(d, i) {
                return vm.riskid?(d.color||'#aaaaaa'):CONFIG.COLORS[i]; // = color(i);
              })
              // .style("stroke", function(d) {
              //   return d3.rgb('#aaaaaa');
              // })
              .attr('data-title', function(d) {
                return d.name// + "\n" + format(d.value);
              })


            // add in the title for the nodes
            node.append("text")
              .attr("x", -6)
              .attr("y", function(d) {
                return d.dy / 2;
              })
              .attr("dy", "0.50em")
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
            
            //assign events
            node.on('mousedown',clickNode);
            link.on('mousedown',clickLink);
            
            node.on('dblclick',vm.addNodeRelations);
            link.on('dblclick',vm.goToSelected);
            
            node.on('contextmenu',vm.deleteSelected);
            
        };
            
        //register events==============================>
        
        function clickNode(obj,i){ 
          clearSelection();
          d3.select(this).select("rect").classed("selected", !d3.select(this).classed("selected"));
          selectElement(obj,'node');
          d3.event.stopPropagation(); //events hack
        }
        function clickLink(obj,i){ 
          clearSelection();
          d3.select(this).classed("selected", !d3.select(this).classed("selected"));
          selectElement(obj,'link');
          d3.event.stopPropagation(); //events hack
        }

        //clear selection event
        angular.element("#"+vm.containerId).on('mousedown',clearSelection);
        
        //help functions
        function clearSelection(){
          $timeout(function(){vm.selectedId = null; },0);
          d3.select("#"+vm.containerId+" svg").selectAll(".link").classed("selected", false);
          d3.select("#"+vm.containerId+" svg").selectAll(".node").select("rect").classed("selected", false);
        }
        function selectElement(obj,type){
          var id = obj?obj.id:null;
          if(!id) return;
          else {
            if(id.indexOf('/')!==-1) id = id.substr(id.lastIndexOf('/')+1);
            $timeout(function(){
              vm.selectedId = id; 
              vm.selectedItem={type:type,obj:obj};
            },0);
            if(vm.showDetails && vm.alwaysOnDetails) { //reload element hack
              $timeout(function(){vm.showDetails=false; },0);
              $timeout(function(){vm.showDetails = true;},100);
            }
          }
        }
        function idLabel(id){
          return id.substr(id.lastIndexOf("/")+1);
        }
        function chartCss(attr){
          var elem=document.getElementById(vm.containerId);
          if(elem) return Number(getComputedStyle(elem, null).getPropertyValue(attr).replace('px',''));
          else return null;
        }
        
        //end of controller
      }

    };
  });
