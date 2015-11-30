registerBehavior('press+hold', function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, fire, begin, update, end) {

	onTouchStart(function(event) {
		console.log('touch started');
	});
	
});