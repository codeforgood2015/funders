$(document).ready(function(){
	var data = {}

	var data_json;
	//var states = {}
	var color;
	var currentMousePos = { x: -1, y: -1 };
	var legend = d3.select('#legend')
					.append('ul')
					.attr('class', 'list-inline');
	//var scale;
	var w = parseInt(d3.select('#container').style('width'));
	var h = w * 0.6;
	var currentMousePos = { x: -1, y: -1 };

	svg = d3.select("#container")
			.append("svg")
			.attr("width", w)
			.attr("height", h);


$(window).on('resize', function(){
	updateMap(data_json);
})
	$.get('/organization/', function(data){
		data_json = data.content.message;
		updateMap(data.content.message);
	});

	$(document).mousemove(function(event) {
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;
	});

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
                  return labels.join(', ') + ' ▾';
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
                  return labels.join(', ') + ' ▾';
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

	$("#close").click(function(){
		d3.select("#tooltip").classed("hidden", true);
	})

	/*$("input[name='funding_area']").change(function(){
		var populations = ""
		$("input[name='funding_area']:checked").each(function() {
			populations += this.value + ","
		});
		if (populations != ""){
			populations = populations.substring(0, populations.length-1);
			data.populations = populations;
		}
		else{
			delete data.populations;
		}
		returnQuery(data);
	})

	$("input[name='supported_strategies']").change(function(){
		var strategies = ""
		$("input[name='supported_strategies']:checked").each(function() {
			strategies += this.value + ","
		});
		if (strategies != ""){
			strategies = strategies.substring(0, strategies.length-1);
			data.supported_strategies = strategies;
		}
		else{
			delete data.supported_strategies;
		}

		                  console.log(data)
		returnQuery(data);
	})*/

	$("#year").change(function(){
		data.year = this.value; 
 		returnQuery(data);
  	})

	function updateMap(data){

		w = parseInt(d3.select('#container').style('width'));
		h = w * 0.6;

	//Define map projection
	var projection = d3.geo.albersUsa()
	.translate([w/2, h/2]).scale([w]);
		//Define path generator
	var path = d3.geo.path()
		.projection(projection);

		var states = {}
		data.forEach(function(funder){
			if (!states[funder.state]){
				states[funder.state] = funder.annual_grantmaking
			}
			else{
				states[funder.state] += funder.annual_grantmaking
			}
		})
		//Load in GeoJSON data
		d3.json("/files/us-states.json", function(json) {
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

			// create initial paths
			svg.selectAll("path")
				.data(json.features)
				.enter()
				.append("path")
				.attr("d", path)
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

			// update choropleth
			svg.selectAll("path")
				.data(json.features)
				.attr("d", path)
				.transition().duration(700)
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

			var force = d3.layout.force()
    					.size([w, h]);

			var nodes = data;

			  // Create the node circles.
  			var node = svg.selectAll(".node")
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
				.style("opacity", 1)
				.attr("r", 0).transition().duration(700)
				.attr("r", function(d) {
					return scale(d.annual_grantmaking);
				})
				.call(addForce)

    		node
    			.attr("cx", function(d) {
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function(d) {
					return projection([d.longitude, d.latitude])[1];
				})
				.transition().duration(700)
				.attr("r", function(d) {
					return scale(d.annual_grantmaking);
				})
				.call(addForce)
			

			node
    			.on("mouseover", function(d) {
					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.select(this).attr("cx")) + 80;
					var yPosition = parseFloat(d3.select(this).attr("cy")) + h/2;

					//Update the tooltip position and value
					d3.select("#tooltip")
						.style("left", currentMousePos.x + "px")
						.style("top", currentMousePos.y + "px")						
						.select("#text")
						.html("Organization: " + d.organization_name + 
							"<br>Asset size: $" + d.asset_size + 
							"<br>Annual grantmaking: $" + d.annual_grantmaking +
							"<br><a href=/organization/" + d._id + ">More Info</a>")
						//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
				})


    		node.exit().transition().duration(700)
    				.style("opacity", 0).remove();

			force.gravity(3.0).charge(-1).nodes(nodes);
    		force.start();
			function addForce(){

				var collide = true;

				while (collide){
					collide = false;
			for (var i = 0; i < nodes.length; i++){
				for (var j = i; j < nodes.length; j++){
					if (i != j){
						var c1 = nodes[i];
						var c2 = nodes[j];

						var lon1 = c1.longitude;
						var lon2 = c1.longitude;
						var lat1 = c1.latitude;
						var lat2 = c2.latitude;

						var r = scale(nodes[i].annual_grantmaking) + scale(nodes[j].annual_grantmaking);

						var d = Math.sqrt((lon2 - lon1) * (lon2 - lon1) + (lat2 - lat1) * (lat2 - lat1));

						if ((75 * d) < r){
							c1.longitude -= 0.1;
							c1.latitude -= 0.1;
						}
					}
				}
			}

		}

		    		node
    			.attr("cx", function(d) {
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function(d) {
					return projection([d.longitude, d.latitude])[1];
				})

			}
		})
	}

	function returnQuery(dataObj){
		var queryString = decodeURIComponent($.param(dataObj));
		$.get('/organization/?' + queryString, function(data){
			  		  		data_json = data.content.message;
			updateMap(data.content.message);
		});
	}

})