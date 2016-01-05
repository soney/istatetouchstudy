registerBehavior("tap", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

onTouchStart(function(event) {
    console.log(event);
    fire();
});

});