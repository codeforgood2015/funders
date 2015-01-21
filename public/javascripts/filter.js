$(document).ready(function(){
	var data = {}
	var w = 1000;
	var h = 600;
	//Define map projection
	var projection = d3.geo.albersUsa()
		.translate([w/2, h/2]).scale([1100]);
			//Define path generator
	var path = d3.geo.path()
		.projection(projection);
			//Create SVG element
	svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	var scale;

	$.get('/organization/', function(data){
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

			//Load in GeoJSON data
			d3.json("/files/us-states.json", function(json) {
			scale = d3.scale.linear().domain([0, d3.max(data, function(d){
				console.log(d);
				return d.annual_grantmaking;
			})]).range([2, 50]);
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
				//.attr("r", 5)
				.attr("r", function(d) {
					console.log(scale(d.annual_grantmaking))
					return scale(d.annual_grantmaking);
					//return scale(d)
				})
				.style("fill", "yellow")
				.style("opacity", 0.75);

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
					console.log(d.annual_grantmaking);
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function(d) {
					return projection([d.longitude, d.latitude])[1];
				})
				.attr("r", function(d) {
					//console.log(scale(d))
					return scale(d.annual_grantmaking)
				})
				//.attr("r", 10)
				.style("fill", "yellow")
				.style("opacity", 0.75);
						circles.exit().remove();
			//circles.exit().remove();
		}
		function returnQuery(dataObj){
			var queryString = decodeURIComponent($.param(dataObj));
			$.get('/organization/?' + queryString, function(data){
				updateMap(data.content.message);
			});
		}

	})