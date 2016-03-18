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
      controller: function($scope, $timeout, toastr, CARRE, $location, CONFIG, Risk_elements, $state, SweetAlert) {

        var vm = $scope;
        vm.loading = false;
          //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections || 4;
        vm.minConnections = 6;
        var elem=getComputedStyle(document.getElementById('chart'), null);
        console.log('Chart Element',elem);
        vm.height = vm.height || 1000;
        vm.customHeight = 0;



        vm.addSize = function() {
          vm.customHeight += 100;
          var width = Number(vm.height) + vm.customHeight + 'px';
          angular.element('#chart svg').css('width',width);
        }

        vm.removeSize = function() {
          if (vm.customHeight <= 0) return false;
          vm.customHeight -= 100;
          var width = Number(vm.height) + vm.customHeight + 'px';
          angular.element('#chart svg').css('width',width);
        }


        //start the initialization
        init(vm.riskid);

        function init(id) {
          vm.loading = Risk_elements.associations(id).then(function(data) {

            //set initial nodes and edges
            vm.nodesArr = id ? data.nodes.map(function(obj) {
              var obj_pos = -1;
              //handle colors
              if (id instanceof Array) obj_pos = id.indexOf(obj.id);
              else obj_pos = id.substring(id.lastIndexOf("/") + 1) === obj.id.substring(obj.id.lastIndexOf("/") + 1) ? 0 : -1;
              if (obj_pos >= 0) obj.color = CONFIG.COLORS[obj_pos];

              return obj;
            }) : data.nodes.filter(function(obj) {
              return obj.value > vm.minConnections;
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
        }
        vm.showRiskFactor = function(id, label) {
          //implement a basic confirm popup
          SweetAlert.swal({
              title: "Show the Risk factor?",
              text: "This will redirect you to the \"" + label + "\" risk factor's detail page.",
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#2E8B57",
              confirmButtonText: "Yes, show me!",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                $state.go("main.risk_factors.view", {
                  id: id
                });
              }
            });

        };

        vm.showRiskElement = function(id, label) {
          //implement a basic confirm popup
          SweetAlert.swal({
              title: "Show the Risk element?",
              text: "This will redirect you to the \"" + label + "\" risk element's detail page.",
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#2E8B57",
              confirmButtonText: "Yes, show me!",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                $state.go("main.risk_elements.view", {
                  id: id
                });
              }
            });

        };


        vm.deleteSelected = function(id) {
        }


        vm.renderSankey = function() {
          // Some setup stuff.
          var node_index = {};
          var graph = {
            nodes: vm.nodesArr.map(function(obj, index) {
              node_index[obj.id] = {
                index: index,
                value: obj.value
              };
              obj.name = obj.label;
              return obj;
            }),
            links: vm.edgesArr.map(function(obj) {
              obj.source = node_index[obj.from].index;
              obj.target = node_index[obj.to].index;
              obj.value = (node_index[obj.from].value + node_index[obj.to].value) * 0.01;
              return obj;
            })
          };

            var margin = {top: 10, right: 10, bottom: 10, left: 10},
                width = vm.height - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;
            
            var formatNumber = d3.format(",.0f"), 
                format = function(d) { return formatNumber(d); },
                color = d3.scale.category20b();
            	
            // append the svg canvas to the page
            var svg = d3.select("#chart").append("svg")
            	.attr("width", vm.height)
                .attr("data-height", '0.5678')
                .attr("viewBox",'0 0 1600 800')
              .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");
            
            	   
            // Set the sankey diagram properties
            var sankey = d3.sankey()
                .nodeWidth(10)
                .nodePadding(3)
                .size([width, height]);
            
            var path = sankey.link();
            
            console.log(graph.nodes);

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
              .style("stroke-width", function(d) {
                return Math.max(1, d.dy);
              })
              .sort(function(a, b) {
                return b.dy - a.dy;
              })
              .attr("data-title", function(d) {
                return d.source.name + " vs " + d.target.name + "\n" + format(d.value);
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
                .on("drag", dragmove));

            // add the rectangles for the nodes
            node.append("rect")
              .attr("height", function(d) {
                return d.dy;
              })
              .attr("width", sankey.nodeWidth())
              .style("fill", function(d, i) {
                return d.color||'#aaaaaa' // = color(i);
              })
              .style("stroke", function(d) {
                return d3.rgb('#aaaaaa');
              })
              .attr('data-title', function(d) {
                return d.name + "\n" + format(d.value);
              });


            // add in the title for the nodes
            node.append("text")
              .attr("x", -6)
              .attr("y", function(d) {
                return d.dy / 2;
              })
              .attr("dy", ".36em")
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
              sankey.relayout();
              link.attr("d", path);
            }




        }

        //end of controller
      }

    };
  });
