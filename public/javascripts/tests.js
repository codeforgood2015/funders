//Adding organization
asyncTest("add organization", function(){
	$.ajax({
		url: "/organization/",
		type: "post",
		data: '{"year": "2001","organization" : "Bill and Melinda Foundation", "address" : "320 Memorial Drive, Cambridge, MA 02139", "funder_type" : "family", "asset_size" : 11318466, "isNational": true, "isFundersMember": true,  "annual_grantmaking" : 542650,"annual_grantmaking_vulnerable_population": 123456,"annual_grantmaking_homelessness": 123456, "state" : "Massachusetts","populations" : [{"fund_area" : "Chronic homelessness", "percentage" : "50"},{"fund_area" : "Domestic violence", "percentage" : 50}],"supported_strategies" : [{"strategy" : "Affordable housing", "percentage": ""},{"strategy" : "Emergency shelter", "percentage": "25"},{"strategy" : "Funding advocacy", "percentage" : ""}]}',
		contentType : 'application/json',
		dataType: "json",
		success: function(data){
			console.log(data);
			console.log("SUCCCESS!!!");
			equal(data.success, true);
			start();
		},
		error: function(xhr, status){
			console.log(xhr.status);
		}
	});
})

asyncTest("get organization", function(){
	$.ajax({
		url: "/organization",
		type: "get",
		contentType : 'application/json',
		dataType: "json",
		success: function(data){
			console.log(data);
			equal(data.success, true);
			start();
		},
		error: function(xhr, status){
			console.log(xhr.status);
		}
	})
})

