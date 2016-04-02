registerBehavior("left then right", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000,
    MAX_MOVEMENT = 100,
    touchID,
    validTouch = true,
    movingRight = false,
    originalLocation,
    lastLocation;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    touchID = touch;
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    lastLocation = originalLocation;
    validTouch = true;
    movingRight = false;
});

onTouchEnd(function(event) {
    var touch = event.changedTouches[0];
    if(validTouch && event.targetTouches.length === 1) {
        if (movingRight) {
            fire();
        }
    }
});

onTouchMove(function(event) {
        var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
        if (validTouch && distance(y, originalLocation.y) > MAX_MOVEMENT) {
            validTouch = false;
        }
        if (movingRight === false) {
            if (lastLocation.x < x) {
                movingRight = true;
            }
        }
        else if (movingRight === true) {
            if (lastLocation.x > (x + 20)) {
                validTouch = false;
            }
        }
        lastLocation.x = x;
});

function distance(x1, x2) {
    return Math.sqrt(Math.pow(x1-x2, 2));
}

});