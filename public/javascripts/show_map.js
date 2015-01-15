
 $(document).ready(function(){
 	console.log('{“user”: “Bill”, “year”: 1999,"organization" : "Bill and Melinda Foundation","location" : "Washington","funder_type" : "family","asset_size" : "11318466","annual_giving" : "542650",“annual_giving_vulnerable_population”: 123456,“annual_giving_homelessness”: 123456,“state” : “Massachusetts”,"funding_areas" : [{"fund_area" : "Chronic homelessness", "percentage" : "50"},{"fund_area" : "Domestic Violence", "percentage" : "50}],"supported_strategies" : [{"strategy" : "Affordable Housing", "percentage": ""},{"strategy" : "Emergency Shelter", "percentage": "25"},{"strategy" : "Funding Advocacy", "percentage" : ""}]}');
  d3.json("/files/us-named.json", function (data) {
    topo = topojson.feature(data, data.objects.states);
			var map2=$("#container");
			console.log(google.maps.Map)
			var map = new google.maps.Map(map2[0], {
					zoom: 3,
					minZoom: 3,
					maxZoom:9,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					center: new google.maps.LatLng(50, -110), // Mozambique
					styles:[{"stylers": [{"saturation": -25},{"lightness": 25}]}]					
				});

			var overlay = new google.maps.OverlayView();

			overlay.onAdd = function () {

				var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
				var svg = layer.append("svg")
					.attr("width", map2.width())
					.attr("height", map2.height())
				var state = svg.append("g");

				overlay.draw = function () {
					var overlayProjection = this.getProjection();
						var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

					// Turn the overlay projection into a d3 projection
					var googleMapProjection = function (coordinates) {
						var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
						var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
						return [pixelCoordinates.x, pixelCoordinates.y];
					}

					path = d3.geo.path().projection(googleMapProjection);
					state.selectAll("path")
						.data(topo.features)
						.attr("d", path) // update existing paths
					.enter().append("svg:path")
						.attr("d", path).style("fill", "yellow")
						.on("mouseover", function(d) {  
													this.style.stroke = "#FFF"
							this.style.strokeWidth = "3px"   
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html(d.properties.name)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        	.on("mouseout", function(d) {       
        									this.style.stroke = "#00F"
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
						/*.on("mouseover", function(d) {
							console.log(d.properties.name)
							this.style.stroke = "#FFF"
							this.style.strokeWidth = "3px"
      					})
      					.on("mouseout",  function(d) {
							this.style.stroke = "#00F"
      					});*/
				};

			};
			overlay.setMap(map);
		})
	}) 