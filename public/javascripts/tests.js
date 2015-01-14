//Adding listing
asyncTest("add listing", function(){
	$.ajax({
		url: "/organizations/",
		type: "post",
		data: '{"title": "bike", "description": "book", "image": "my book", "category": "textbooks"}',
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

