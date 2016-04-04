registerBehavior("swipe up", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

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
    if (validTouch && touch.identifier === touchID && distance(originalLocation.y, lastLocation.y) >= MIN_MOVEMENT) {
        fire();
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
    if (y > lastLocation.y + 10) {
        validTouch = false;
    }
	if (distance(x, originalLocation.x) > MAX_MOVEMENT) {
        validTouch = false;
    }
    lastLocation.x = x;
    lastLocation.y = y;
});

function distance(y1, y2) {
    return Math.sqrt(Math.pow(y1-y2, 2));
}

});