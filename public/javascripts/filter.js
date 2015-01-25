$(document).ready(function(){
  var data = {};
  var data_json;
  var width = parseInt(d3.select('#map').style('width'));
  var w = parseInt(d3.select('#map').style('width'));
  var h = w * 0.6;
  var centered;

var scale;
  var node;
    var currentMousePos = { x: -1, y: -1 };

    var legend = d3.select('#legend')
          .append('ul')
          .attr('class', 'list-inline');

var projection = d3.geo.albersUsa()
    .scale(w)
    .translate([w / 2, h / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", w)
    .attr("height", h);

var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
.scaleExtent([w, 32 * w])
    .on("zoom", zoomed);


var g = svg.append("g")
.call(zoom);

g.append("rect")
    .attr("class", "background")
    .attr("width", w)
    .attr("height", h)



function zoomed() {

  var t = d3.event.translate,
      s = d3.event.scale;

t[0] *= w/width;
t[1] *= w/width;

  projection.translate(t).scale(s * w/width);
  g.selectAll("path").attr("d", path);
          d3.select("#tooltip").classed("hidden", true);
             node
                .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
            })
          .attr("r", function(d) {
          return scale(d.annual_grantmaking * d3.event.scale/2000);
        })  


}
$(window).on('resize', function(){
    w = parseInt(d3.select('#map').style('width'));
    h = w * 0.6;

   projection = d3.geo.albersUsa()
    .scale(w)
    .translate([w /2, h / 2]);

    path = d3.geo.path()
    .projection(projection);
  g.selectAll("path").attr("d", path);

               node
                .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
            })
          .attr("r", function(d) {
          return scale(d.annual_grantmaking * w/(2*width));
        })  
})
  $.get('/organization/', function(data){
    data_json = data.content.message;
    updateMap(data.content.message);
  });

  /*$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
  });*/

            $('#population-dropdown').multiselect({
              includeSelectAllOption: true,
              buttonText: function(options, select){
                if (options.length === 0) {
                    delete data.populations;
                  returnQuery(data);
                    return 'None Selected ▾';
                }
                else{
                  var labels = [];
                  options.each(function() {
                    if ($(this).attr('label') !== undefined) {
                      labels.push($(this).attr('label'));
                    }
                    else {
                      labels.push($(this).html());
                    }
                  });
                  data.populations = labels.join(',');
                  returnQuery(data);
                  //return labels.join(', ') + ' ▾';
                  return 'View Selected ▾';
                }
              }
            });
            $('#strategies-dropdown').multiselect({
              includeSelectAllOption: true,
              numberDisplayed: 13,
              buttonText: function(options, select){
                if (options.length === 0) {
                  delete data.supported_strategies;
                  returnQuery(data);

                    return 'None Selected ▾';
                }
                else{
                  var labels = [];
                  options.each(function() {
                    if ($(this).attr('label') !== undefined) {
                      labels.push($(this).attr('label'));
                    }
                    else {
                      labels.push($(this).html());
                    }
                  });
                  data.supported_strategies = labels.join(',');
                  returnQuery(data);
                  //return labels.join(', ') + ' ▾';
                  return 'View Selected ▾';
                }
              }
            });

  $("#populations").change(function(){
      if (this.value == "All"){
          $.get('/organization/', function(data){
            data_json = data.content.message;
          updateMap(data.content.message);
        }); 
      }
      else {
        document.getElementById("strategies").selectedIndex = 0;
        $.get('/organization/population/' + this.value, function(data){
          data_json = data.content.message;
          updateMap(data.content.message);
        });
      }
    })

  $("#strategies").change(function(){
      if (this.value == "All"){
          $.get('/organization/', function(data){
            data_json = data.content.message;
          updateMap(data.content.message);
        }); 
      }
      else {
          document.getElementById("populations").selectedIndex = 0;
        $.get('/organization/strategy/' + this.value, function(data){
          data_json = data.content.message;
          updateMap(data.content.message);
        });
      }
    })
  $("#year").change(function(){
    data.year = this.value; 
    returnQuery(data);
    })
  $("#close").click(function(){
    d3.select("#tooltip").classed("hidden", true);
  })

function updateMap(data){

    w = parseInt(d3.select('#map').style('width'));
    h = w * 0.6;

    var states = {}
    data.forEach(function(funder){
      if (!states[funder.state]){
        states[funder.state] = funder.annual_grantmaking
      }
      else{
        states[funder.state] += funder.annual_grantmaking
      }
    })

d3.json("/files/us-states.json", function(error, json) {

      for (var i = 0; i < json.features.length; i++){
        var state = json.features[i].properties.name

        if (states[state]){
          json.features[i].properties.value = states[state];
        }
      }
      var color = d3.scale.quantize().range(colorbrewer.Blues[5]);
      color.domain([0, d3.max(json.features, function(d) { return d.properties.value; })
      ]);

      scale = d3.scale.linear().domain([0, d3.max(data, function(d){
        return d.annual_grantmaking;
      })]).range([w/250, w/50]);

        var keys = legend.selectAll('li.key')
              .data(color.range());

      keys.enter().append('li')
            .attr('class', 'key')
            .style('border-top-color', String)
            .text(function(d) {
              var r = color.invertExtent(d);
              return "$" + r[0].toFixed(2);
            });

      keys.attr('class', 'key')
        .style('border-top-color', String)
        .text(function(d) {
          var r = color.invertExtent(d);
          if (isNaN(r[0])){
            return "";
          }
          return "$" + r[0].toFixed(2);
        });

    g.selectAll("path")
      .data(json.features)
    .enter().append("path")
      .attr("d", path)
      //.on("click", clicked)
              .style("stroke-width", 1)
        .style("stroke", 'black')
        .style("fill", function(d) {
            //Get data value
            var value = d.properties.value;
            if (value) {
              return color(value);
            } 
            else {
              return "#efefef";
            }
        });

      g.selectAll("path")
        .data(json.features)
        .attr("d", path)
        .transition().duration(750)
        .style("fill", function(d) {
            //Get data value
            var value = d.properties.value;
            if (value) {
              return color(value);
            } 
            else {
              //If value is undefined…
              return "#efefef";
            }
        });

      var keyFn = function(d) { return d._id; };

      var nodes = data;

        // Create the node circles.
        node = g.selectAll(".node")
                .data(nodes, keyFn)
            node
              .enter().append("circle")
                .attr("class", "node")
                .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
            })
        .style("fill", function(d){
          if (d.isNational){
            return "red";
          }
          else {
            return "green";
          }
        })
        .style("opacity", 0.6)
        .attr("r", 0).transition().duration(750)
        .attr("r", function(d) {
          return scale(d.annual_grantmaking);
        })    
        //.attr("transform", function(d) { return "translate(" + d + ")"; });

        node
           .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
            })
        .transition().duration(750)

        .attr("r", function(d) {
          return scale(d.annual_grantmaking);
        })

        node
          .on("mouseover", function(d) {
          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.select(this).attr("cx")) + w/2;
          var yPosition = parseFloat(d3.select(this).attr("cy")) + h/4;

          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#text")
            .html("Organization: " + d.organization_name + 
              "<br>Asset size: $" + d.asset_size + 
              "<br>Annual grantmaking: $" + d.annual_grantmaking +
              "<br><a href=/organization/" + d._id + ">More Info</a>")
            //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);
        })


        node.exit().transition().duration(750)
            .style("opacity", 0).remove();
});
}

/*function clicked(d) {
      var x, y, k;
  if (d && centered !== d.id) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 3;
    centered = d.id;
  } else {
    x = w / 2;
    y = h / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(1000)
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}*/

/*function clicked(d) {
  var centroid = path.centroid(d),
      translate = projection.translate();

  projection.translate([
    translate[0] - centroid[0] + w / 2,
    translate[1] - centroid[1] + h / 2
  ]);

  zoom.translate(projection.translate());

  g.selectAll("path").transition()
      .duration(700)
      .attr("d", path);
}*/

  function returnQuery(dataObj){
    var queryString = decodeURIComponent($.param(dataObj));
    $.get('/organization/?' + queryString, function(data){
                  data_json = data.content.message;
      updateMap(data.content.message);
    });
  }
})