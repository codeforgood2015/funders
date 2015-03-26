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
	$.post(
		'/login', 
		helpers.getFormData(this)
	).done(function(response){
		success = response.success;
		data ='';
		if (response.error){
			error = true;
			message = response.error;
			data ='e='+error+'&msg='+message;
			loadPage('login', data);
		}
		else if (response.success){
			currentUser = response.user;
			loadPage('dashboard', data);
		}
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
			currentUser = response.user;
			data = 'e=false'; 
		}
		loadPage('form1', data);
	});
});

$(document).on('submit', '#forgot_password', function(evt){
	evt.preventDefault();
	$.post(
		'/users/forgot', 
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
			data = 's=true&msg='+response.message; 
		}
		loadPage('form1', data);
	});
});

$(document).on('submit', '#password_reset_form', function(evt){
	evt.preventDefault();
	var item = $(this).parent();
	var password1 = $('#password1').val();
	var password2 = $('#password2').val();
	var token = $('#token').val();
	if (!(password1 === password2)){
		message = 'Passwords do not match';
		error = true;
		data='e='+error+'&msg='+message;
		loadPage('users/reset/'+token, data);
	}
	else{
		$.post(
			'/users/reset/'+token, 
			{
				password: password1
			}
		).done(function(response){
			data = '';
			success = response.success;
			
			if (response.success){
	  			window.location.href = "http://"+host +"/";
	  		}
	  		else {
				error = true;
				message = response.error;
				data ='e='+error+'&msg='+message;
				loadPage('users/reset/'+token, data);
			}
			
		});
	}
});
