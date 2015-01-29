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

$(document).on('submit', '#request_form', function(evt){
	evt.preventDefault();
	$.post(
		'/request', 
		helpers.getFormData(this)
	).done(function(response){
		console.log(respones);
		success = response.success; 
		data = ''
	})

})