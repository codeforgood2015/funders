
 $(document).ready(function(){
  d3.json("/files/us-named.json", function (data) {
    topo = topojson.feature(data, data.objects.states);
			var map2=$("#container");
			console.log(google.maps.Map)
			var map = new google.maps.Map(map2[0], {
					zoom: 3,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					center: new google.maps.LatLng(50, -97), // Mozambique
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
							console.log(d.properties.name)
							this.style.stroke = "#FFF"
							this.style.strokeWidth = "3px"
      					})
      					.on("mouseout",  function(d) {
							this.style.stroke = "#00F"
      					});
				};

			};
			overlay.setMap(map);
		})
	}) 