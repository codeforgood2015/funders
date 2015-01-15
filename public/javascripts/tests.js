//Adding organization
asyncTest("add organization", function(){
	$.ajax({
		url: "/organization/",
		type: "post",
		//data: '{“user”: “Bill”, “year”: 1999,"organization" : "Bill and Melinda Foundation","location" : "Washington","funder_type" : "family","asset_size" : "11318466","annual_giving" : "542650",“annual_giving_vulnerable_population”: 123456,“annual_giving_homelessness”: 123456,“state” : “Massachusetts”,"funding_areas" : [{"fund_area" : "Chronic homelessness", "percentage" : "50"},{"fund_area" : "Domestic Violence", "percentage" : "50}],"supported_strategies" : [{"strategy" : "Affordable Housing", "percentage": ""},{"strategy" : "Emergency Shelter", "percentage": "25"},{"strategy" : "Funding Advocacy", "percentage" : ""}]}',
		data: '{"user": "Bill", "year": "1999","organization" : "Bill and Melinda Foundation"}',
		contentType : 'application/json',
		dataType: "json",
		success: function(data){
			console.log(data);
			equal(data.success, true);
			equal(data.content.description, "book");
			equal(data.content.image, "my book");
			equal(data.content.category, "textbooks");
			start();
		},
		error: function(xhr, status){
			console.log(xhr.status);
		}
	});
})

