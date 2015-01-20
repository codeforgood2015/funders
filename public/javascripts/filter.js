var query = "";
var pquery = "";
var squery = "";

$(document).ready(function(){

	$("input[name='funding_area']").change(function(){
		pquery = "?populations="
		$("input[name='funding_area']:checked").each(function() {
			pquery += this.value + ","
		});
		if (pquery == "?populations="){
			pquery = "";
			query = "?" + squery;
		}
		else {
			pquery = pquery.substring(0, pquery.length-1)
			if (squery == ""){
				query = pquery
				console.log(query);
			}
			else {
				query = pquery + "&" + squery
			}
		}
		$.get('/organization/' + query, function(data){
  			console.log(data.content);
  		});
  	})

  	$("input[name='supported_strategies']").change(function(){
		squery = "supported_strategies="
		console.log(squery);
		$("input[name='supported_strategies']:checked").each(function() {
			console.log(this)
			squery += this.value + ","
		});
		if (squery == "supported_strategies="){
			squery = "";
		}
		else {
			squery = squery.substring(0, squery.length-1)

			if (pquery == ""){
				query = "?" + squery
			}
			else {
				query = pquery + "&" + squery;
			}
		}
		console.log(query);
		$.get('/organization/' + query, function(data){
  			console.log(data.content);
  		});
  	})
})