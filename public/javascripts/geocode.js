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
									window.location = "/";

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



		//code to hidden topic selection, disable for demo
		$("input[name='fund_area']").each(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hidden");
			}
			else {
				$("#" + this.id + "_amount").addClass("hidden");		
			}
		})

		$("input[name='fund_area']").click(function(){
			//console.log($("#" + this.id + "_slider").children(":first"));
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hidden");
			}
			else {
				$("#" + this.id + "_amount").addClass("hidden");		
			}
		})

		$("input[name='strategies']").each(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hidden");
			}
			else {
				$("#" + this.id + "_amount").addClass("hidden");		
			}
		})
		
		$("input[name='strategies']").click(function(){
			if (this.checked){
				$("#" + this.id + "_amount").removeClass("hidden");
			}
			else {
				$("#" + this.id + "_amount").addClass("hidden");		
			}
		})


var sliders = $(".slider");
var availableTotal = 100;

sliders.each(function() {
    var init_value = parseInt($(this).text());

    $(this).siblings('.value').text(init_value);
    $(this).siblings('input.amount').val(0);


    $(this).empty().slider({
        value: init_value,
        min: 0,
        max: availableTotal,
        range: "max",
        step: 2,
        animate: 0,
        slide: function(event, ui) {
            var totalDonation = $("#yearDonation").val() || 0;
            // Update display to current value
             var total = 0;
             var slidersCount = 0;
            	$(this).siblings('.value').text(ui.value.toFixed(2));

            // Get current total

            sliders.not(this).each(function() {
            	if ($(this).parent().hasClass("hidden")){
            		//console.log("hidden")
            	}
            	else {
            		slidersCount++;
                	total += $(this).slider("value");
                }
            });

            // Need to do this because apparently jQ UI
            // does not update value until this event completes
            total += ui.value;
            $(this).siblings('input.amount').val(CurrencyFormatted(ui.value * totalDonation / 100));

            var delta = availableTotal - total;

            sliders.not(this).each(function() {
            	var t = $(this);
            	if (t.parent().hasClass("hidden")){
                	t.siblings('.value').text(0);
                	t.slider('value', 0);
            	}
            	else {

                var value = t.slider("option", "value");

                var new_value = value + (delta/slidersCount);
                
                //console.log(new_value)
                if (new_value < 0 || ui.value == 100) 
                    new_value = 0;
                if (new_value > 100) 
                    new_value = 100;

                t.siblings('.value').text(new_value.toFixed(2));
                t.slider('value', new_value);
                $(this).siblings('input.amount').val(CurrencyFormatted(new_value * totalDonation / 100));
            }
            });
        }
    });
});

$(".amount").change(function(){
	var totalDonation = parseFloat($("#yearDonation").val()) || 0;
	var amount = parseFloat($(this).val());
	var slider = $(this).siblings('.slider');

	if (amount > totalDonation){
		$(this).val(totalDonation);
		slider.slider("value", 100);
		$(this).siblings('.value').text(100);
	}
	else {
		percentage = amount / totalDonation;
		slider.slider("value", percentage * 100);
		$(this).siblings('.value').text((percentage * 100).toFixed(2));
	}
})
		
	})