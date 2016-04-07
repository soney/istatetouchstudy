registerBehavior("press hold to increment", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 20,
    validTouch = true,
    MAX_MOVEMENT = 50,
    touchID,
    originalLocation;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    validTouch = true;
    touchID = touch.identifier;
    recursiveSetTimeout();
});

onTouchEnd(function(event) {
    var touch = event.changedTouches[0];
    validTouch = false;
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;

    if(validTouch && distance(x, y, originalLocation.x, originalLocation.y) > MAX_MOVEMENT) {
        validTouch = false;
    }
    if(touch.identifier != touchID) {
        validTouch = false;
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function recursiveSetTimeout() {
    setTimeout(function() {
        if (validTouch) {
            fire();
            recursiveSetTimeout();
            return;
        }
        else {
            return;
        }
    }, 20);
}








});
