/*
Resets standard alert behavior in Bootstrap.
The alert with data-hide attribute will be hidden, instead of being removed from  DOM
*/
$(function() {
	$('[data-hide]').on('click', function() {
		$('.' + $(this).attr('data-hide')).hide();
	});
});
