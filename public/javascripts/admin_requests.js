$(document).on('click', '#remove', function(event){
	event.preventDefault();
	var r = window.confirm('Are you sure you want to remove this user?');
	var item = $(this).parent();
	var userEmail = item.find('#email').val();
	if(r){
		$.post(
		'/admin/users/remove', 
		{email: userEmail}
		).done(function(response){
			if (response.success){
				data = "s=true"+"&msg=" + response.message;
				loadPage('admin/users', data);
			}
			else{
				data="e=true"+"&msg=" + response.message;
				loadPage('admin/users', data);
			}
		});
	}
});

$(document).on('click', '#member', function(event){
	event.preventDefault();
	var item = $(this).parent();
	var userEmail = item.find('#email').val();
	$.post(
		'/admin/users/group/member', 
		{email: userEmail}
		).done(function(response){
			if (response.success){
				data = "s=true"+"&msg=" + response.message;
				loadPage('admin/users', data);
			}
			else{
				data="e=true"+"&msg=" + response.message;
				loadPage('admin/users', data);
			}
		});
});

$(document).on('click', '#admin', function(event){
	event.preventDefault();
	var item = $(this).parent();
	var userEmail = item.find('#email').val();
	$.post(
		'/admin/users/group/admin', 
		{email: userEmail}
		).done(function(response){
			if (response.success){
				data = "s=true"+"&msg=" + response.message;
				loadPage('admin/users', data);
			}
			else{
				data="e=true"+"&msg=" + response.message;
				loadPage('admin/users', data);
			}
		});
});