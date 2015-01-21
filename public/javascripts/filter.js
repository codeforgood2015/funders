$(document).ready(function(){
	var data = {}
			var w = 750;
			var h = 450;
			//Define map projection
			var projection = d3.geo.albersUsa()
			.translate([w/2, h/2]).scale([1000]);
			//Define path generator
			var path = d3.geo.path()
			.projection(projection);
			//Create SVG element
			svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

	$.get('/organization/', function(data){
  			//console.log(data.content);
  			createMap(data.content.message);
  		});
	//createMap(data);

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
			//Width and height
			console.log(data);

			//Load in GeoJSON data
			d3.json("/files/us-states.json", function(json) {
				
				//Bind data and create one path per GeoJSON feature
				svg.selectAll("path")
				.data(json.features)
				.enter()
				.append("path")
				.attr("d", path);

				svg.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", function(d) {
					console.log(d);
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function(d) {
					return projection([d.longitude, d.latitude])[1];
				})
				.attr("r", 5)
				.style("fill", "yellow")
				.style("opacity", 0.75);
		/*for (var i = 0; i < data.length; i++) {

            //Grab state name
            console.log(data[i].state)
            var dataState = data[i].state;
        }*/

            //Grab data value, and convert from string to float
            /*var dataValue = parseFloat(data[i].value);

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

            	var jsonState = json.features[j].properties.name;

            	if (dataState == jsonState) {

                //Copy the data value into the JSON
                json.features[j].properties.value = dataValue;

                //Stop looking through the JSON
                break;

            }*/

        });
		}

		function updateMap(data){
			console.log(data);
			console.log(svg);

			var keyFn = function(d) { return [d.longitude, d.latitude]; };

			var circles = svg.selectAll("circle")
				.data(data, keyFn)
			circles
				.enter()
				.append("circle")
				.attr("cx", function(d) {
					console.log(d);
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function(d) {
					return projection([d.longitude, d.latitude])[1];
				})
				.attr("r", 5)
				.style("fill", "yellow")
				.style("opacity", 0.75);
						circles.exit().remove();
			//circles.exit().remove();
		}
		function returnQuery(dataObj){
			var queryString = decodeURIComponent($.param(dataObj));
			$.get('/organization/?' + queryString, function(data){
				console.log(data.content);
				updateMap(data.content.message);
			});
		}

	})