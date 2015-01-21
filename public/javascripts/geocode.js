	$(document).ready(function(){
		data = {};
		$("#input_form").validate({
			submitHandler: function(form){
				data.organization = form.organization.value;
				data.year = form.year.value;
				data.state = form.state.value;
				data.address = form.address.value;
				data.asset_size = form.asset.value;
				data.yearDonation = form.yearDonation.value;
				data.funder_type = [];
				data.populations = [];
				data.supported_strategies = [];
				data.isNational = form.national.value;
				data.isFundersMember = form.isMember.value;
				data.latitude;
				data.longitude;

				$("input[name='funder_type']:checked").each(function(){
					data.funder_type.push(this.value);
				});

				$("input[name='fund_area']:checked").each(function() {
					var fund = {};
					fund.area = this.value;
					var fund_area_id = this.id;
					var new_id = "#" + fund_area_id + "_amount";
					var amount = $(new_id).children(":first").val();
					fund.amount = amount;

					data.populations.push(fund);
				});

				$("input[name='strategies']:checked").each(function() {
					var fund = {};
					fund.area = this.value;
					var fund_area_id = this.id;
					var new_id = "#" + fund_area_id + "_amount";
					var amount = $(new_id).children(":first").val();
					fund.amount = amount;

					data.supported_strategies.push(fund);
				});

				// Geocoding
				var geocoder = new google.maps.Geocoder();    // instantiate a geocoder object

				// Get the user's inputted address
				var address = document.getElementById( "address" ).value;

				// Make asynchronous call to Google geocoding API
				geocoder.geocode( { 'address': address }, function(results, status) {
					if (results.length == 0){
						geocoder.geocode({'address': form.state.value}, function(results, status){
							var addr_type = results[0].types[0];	// type of address inputted that was geocoded
							if ( status == google.maps.GeocoderStatus.OK ) {
								latitude = results[0].geometry.location.k;
								longitude = results[0].geometry.location.D;
								data.latitude = latitude;
								data.longitude = longitude;	
								console.log(latitude, longitude)

								$.ajax({
									url: "/organization/",
									type: "post",
									data:  JSON.stringify(data),
									contentType : 'application/json',
									dataType: "json",
									success: function(data){
										console.log(data);

									},
									error: function(xhr, status){
										console.log(xhr.status);
									}
								});
							}
							else    {
								alert("Geocode was not successful for the following reason: " + status);        
							}
						})
				//ShowLocation( results[0].geometry.location, address, addr_type );
			}

			else {
						var addr_type = results[0].types[0];	// type of address inputted that was geocoded
						if ( status == google.maps.GeocoderStatus.OK ) {
							latitude = results[0].geometry.location.k;
							longitude = results[0].geometry.location.D;
							data.latitude = latitude;
							data.longitude = longitude;	

							$.ajax({
								url: "/organization/",
								type: "post",
								data:  JSON.stringify(data),
								contentType : 'application/json',
								dataType: "json",
								success: function(data){
									console.log(data);

								},
								error: function(xhr, status){
									console.log(xhr.status);
								}
							});
				//ShowLocation( results[0].geometry.location, address, addr_type );
			}		
			else     
				alert("Geocode was not successful for the following reason: " + status);    
		}    
	});	
	console.log(JSON.stringify(data));


}
})

		//code to hide topic selection, disable for demo
		$("input[name='fund_area']").each(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hide");
			}
			else {
				$("#" + this.id + "_amount").addClass("hide");		
			}
		})

		$("input[name='fund_area']").click(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hide");
			}
			else {
				$("#" + this.id + "_amount").addClass("hide");		
			}
		})

		$("input[name='strategies']").each(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hide");
			}
			else {
				$("#" + this.id + "_amount").addClass("hide");		
			}
		})
		
		$("input[name='strategies']").click(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hide");
			}
			else {
				$("#" + this.id + "_amount").addClass("hide");		
			}
		})
		
	})