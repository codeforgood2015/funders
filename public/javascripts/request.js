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

$(document).ready(function(){
	$('#request_form').validate();
});

$(document).on('submit', '#request_form', function(evt){
	evt.preventDefault();
	$.post(
		'/request', 
		helpers.getFormData(this)
	).done(function(response){
		data = '';
		if (response.error){
			error = true;
			message = response.error;
			data ='e='+error+'&msg='+message;
			loadPage('request', data);
		}
		else if (response.success){
			currentUser = response.user;
			message = response.message;
			data = 'msg=' + message + '&s=true';
			loadPage('request', data);
		}
		else{
			loadPage('form1');
		}
	});

});