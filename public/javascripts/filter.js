$(document).ready(function(){
	var data = {}

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

  	function returnQuery(dataObj){
		var queryString = decodeURIComponent($.param(dataObj));
		$.get('/organization/?' + queryString, function(data){
  			console.log(data.content);
  		});
	}

})