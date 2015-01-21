$(document).ready(function(){


	var data = {}
	var states = {}
	var w = 1500;
	var h = 900;
	var currentMousePos = { x: -1, y: -1 };
	//Define map projection
	var projection = d3.geo.albersUsa()
		.translate([w/2, h/2]).scale([1600]);
			//Define path generator
	var path = d3.geo.path()
		.projection(projection);
			//Create SVG element
	svg = d3.select("#container")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	var scale;

	$.get('/organization/', function(data){
  		createMap(data.content.message);
  	});

  	$(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    $("#close").click(function(){
    	d3.select("#tooltip").classed("hidden", true);
    })

	$("input[name='funding_area']").change(function(){
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
		returnQuery(data);
	})

	function createMap(data){
		console.log(data);
			//Load in GeoJSON data
			data.forEach(function(funder){
				if (!states[funder.state]){
					states[funder.state] = funder.annual_grantmaking
				}
				else{
					states[funder.state] += funder.annual_grantmaking
				}

			})
							console.log (states)
			d3.json("/files/us-states.json", function(json) {
				scale = d3.scale.linear().domain([0, d3.max(data, function(d){
					return d.annual_grantmaking;
				})]).range([3, 10]);

				for (var i = 0; i < json.features.length; i++){
					var state = json.features[i].properties.name

					if (states[state]){
						json.features[i].properties.value = states[state];
					}
					/*else {
						json.features[i].properties.value = 0;
					}*/
				}

				var color = d3.scale.quantize().range(colorbrewer.Blues[5]);
								//.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
				color.domain([
					d3.min(json.features, function(d) { return d.properties.value; }), 
					d3.max(json.features, function(d) { return d.properties.value; })
				]);

var legend = d3.select('#legend')
  .append('ul')
    .attr('class', 'list-inline');

var keys = legend.selectAll('li.key')
    .data(color.range());

keys.enter().append('li')
    .attr('class', 'key')
    .style('border-top-color', String)
    .text(function(d) {
        var r = color.invertExtent(d);
        console.log(r)
        return "$" + r[0].toFixed(2);
    });
				//Bind data and create one path per GeoJSON feature
				svg.selectAll("path")
					.data(json.features)
					.enter()
					.append("path")
					.attr("d", path)
					.style("fill", function(d) {
					   		//Get data value
					   		var value = d.properties.value;
					   		
					   		if (value) {
						   		return color(value);
					   		} else {
					   			//If value is undefined…
						   		return "#ccc";
					   		}
					   });
					/*.on("mouseover", function(d) {
						//Update the tooltip position and value/*
						d3.select("#tooltip")
						.style("left", currentMousePos.x + "px")
						.style("top", currentMousePos.y + "px")						
						.select("#value")
						.text(d.properties.name);
			   
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);
			   		})
			   		.on("mouseout", function() {
			   
						//Hide the tooltip
						d3.select("#tooltip").classed("hidden", true);
					
			   		})*/


				svg.selectAll("circle")
					.data(data)
					.enter()
					.append("circle")
					.attr("cx", function(d) {
						return projection([d.longitude, d.latitude])[0];
					})
					.attr("cy", function(d) {
						return projection([d.longitude, d.latitude])[1];
					})
					.attr("r", function(d) {
						return scale(d.annual_grantmaking);
					})
					.style("fill", "yellow")
					.style("opacity", 0.75)

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
        	});
		}

		function updateMap(data){

			var keyFn = function(d) { return [d.longitude, d.latitude]; };

			var circles = svg.selectAll("circle")
				.data(data, keyFn)
			circles
				.enter()
				.append("circle")
				.attr("cx", function(d) {
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function(d) {
					return projection([d.longitude, d.latitude])[1];
				})
				.attr("r", function(d) {
					return scale(d.annual_grantmaking)
				})
				.style("fill", "yellow")
				.style("opacity", 0.75)
					.on("mouseover", function(d) {
						//Get this bar's x/y values, then augment for the tooltip
						var xPosition = parseFloat(d3.select(this).attr("cx")) + 80;
						var yPosition = parseFloat(d3.select(this).attr("cy")) + h/2;

						//Update the tooltip position and value
						d3.select("#tooltip")
						.style("left", currentMousePos.x + "px")
						.style("top", currentMousePos.y + "px")						
						.select("#value")
						.text(d.organization_name);
			   
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);
			   		})
			   		.on("mouseout", function() {
			   
						//Hide the tooltip
						d3.select("#tooltip").classed("hidden", true);
					
			   		})
			circles.exit().remove();
		}
		function returnQuery(dataObj){
			var queryString = decodeURIComponent($.param(dataObj));
			$.get('/organization/?' + queryString, function(data){
				updateMap(data.content.message);
			});
		}

	})