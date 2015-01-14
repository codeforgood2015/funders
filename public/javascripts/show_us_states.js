$(document).ready(function() {
	var map = new Datamap({
        element: document.getElementById('container'),
        scope: 'usa',
        height: 500,
        width: 800,
        responsive: true
    });

        //alternatively with jQuery
    $(window).on('resize', function() {
       map.resize();
    });
})