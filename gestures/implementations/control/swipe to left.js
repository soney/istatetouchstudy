registerBehavior("swipe to left", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_MOVEMENT = 50,
    MIN_MOVEMENT = 200,
    originalLocation,
    lastLocation,
    touchID,
    validTouch;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    lastLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    touchID = touch.identifier;
    validTouch = true;
});

onTouchEnd(function(event) {
    var touch = event.changedTouches[0];
    if (validTouch && touch.identifier === touchID && distance(originalLocation.x, lastLocation.x) >= MIN_MOVEMENT) {
        fire();
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
    if (x > lastLocation.x + 10) {
        validTouch = false;
    }
	if (distance(y, originalLocation.y) > MAX_MOVEMENT) {
        validTouch = false;
    }
    lastLocation.x = x;
    lastLocation.y = y;
});

function distance(y1, y2) {
    return Math.sqrt(Math.pow(y1-y2, 2));
}

});