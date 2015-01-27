currentUser = undefined;
var host = window.location.host;
var helpers = (function() {
  var self = {};
  self.getFormData = function(form) {
    var inputs = {};
    $(form).serializeArray().forEach(function(item) {
      inputs[item.name] = item.value;
    });
    return inputs;
  };
  return self;
})();

var loadPage = function(page, data){
	window.location.href = "http://"+host+'/'+page + '/?'+data;
}

$(document).on('submit', '#signin_form', function(evt){

	evt.preventDefault();
	console.log('INSIDE THE FORM');
	$.post(
		'/login', 
		helpers.getFormData(this)
	).done(function(response){
		console.log(response);
		success = response.success;
		data ='';
		if (response.error){
			error = true;
			message = response.error;
			data ='e='+error+'&msg='+message;
		}
		else if (response.success){
			currentUser = response.user;
			data = 'e=false';
		}
		loadPage('form1', data);
	})
});



$(document).on('submit', '#registration_form', function(evt){
	evt.preventDefault();
	$.post(
		'/users', 
		helpers.getFormData(this)
	).done(function(response){
		data = '';
		success = response.success;
		if (response.error){
			error = true;
			message = response.error;
			data ='e='+error+'&msg='+message;
		}
		else if (response.success){
			currentUser = responser.user;
			data = 'e=false'; 
		}
		loadPage('form1', data);
	})
})