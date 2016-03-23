registerBehavior("up then down", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000,
    MAX_MOVEMENT = 100,
    touchID,
    validTouch = true,
    movingDown = false;
var originalLocation;
var lastLocation;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    touchID = touch;
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    lastLocation = originalLocation;
    validTouch = true;
    movingDown = false;
});

onTouchEnd(function(event) {
    var touch = event.changedTouches[0];
    if(validTouch && event.targetTouches.length === 1) {
        if (movingDown) {
            fire();
        }
    }
});

onTouchMove(function(event) {
        var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
        if (validTouch && distance(x, originalLocation.x) > MAX_MOVEMENT) {
            validTouch = false;
        }
        if (movingDown === false) {
            if (lastLocation.y < y) {
                movingDown = true;
            }
        }
        else if (movingDown === true) {
            if (lastLocation.y > (y + 20)) {
                validTouch = false;
            }
        }
        lastLocation.y = y;
});

function distance(x1, x2) {
    return Math.sqrt(Math.pow(x1-x2, 2));
}

});