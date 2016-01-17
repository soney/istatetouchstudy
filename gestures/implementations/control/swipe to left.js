registerBehavior("swipe to left", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_MOVEMENT = 50,
    MIN_MOVEMENT = 200, // double check what the "min movement" should be
    originalLocation,
    touchID,
    validTouch,
    endingX;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };

    touchID = touch.identifier;
    validTouch = true;
});

onTouchEnd(function(event) {
    var touch = event.changedTouches[0];
    if(validTouch && touch.identifier === touchID && distance(originalLocation.x, endingX) >= MIN_MOVEMENT) {
        fire();
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
    endingX = x;
	if(distance(y, originalLocation.y) > MAX_MOVEMENT) {
        validTouch = false;
    }
});

function distance(y1, y2) {
    return Math.sqrt(Math.pow(y1-y2, 2));
}

});