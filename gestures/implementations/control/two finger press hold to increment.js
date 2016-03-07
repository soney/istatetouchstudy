registerBehavior("two finger press hold to increment", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 20,
    validTouch = true,
    MAX_MOVEMENT = 50,
    ongoingTouches = new Array(),
    originalLocations = new Array();

onTouchStart(function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        ongoingTouches.push(touch.identifier);
        originalLocation = {
            x: touch.clientX,
            y: touch.clientY
        };
        originalLocations.push(originalLocation);
    }
    validTouch = true;
    recursiveSetTimeout();
});

onTouchEnd(function(event) {
    validTouch = false;
});

onTouchMove(function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i],
            x = touch.clientX,
            y = touch.clientY;
        for (var j = 0; j < 2; j++) {
            if (touch.identifier === ongoingTouches[j]) {
                if(distance(x, y, originalLocations[j].x, originalLocations[j].y) > MAX_MOVEMENT) {
                    validTouch = false;
                }
            }
        }
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