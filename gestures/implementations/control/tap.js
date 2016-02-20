registerBehavior("tap", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 100,
    validTouch = true,
    MAX_MOVEMENT = 50,
    touchID,
    timeoutID,
    originalLocation;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    validTouch = true;
    timeoutID = setTimeout(function() { 
        timeoutID = false;
    }, MAX_TIME_MILLISECONDS);
    touchID = touch.identifier;
});

onTouchEnd(function(event) {
    var touch = event.changedTouches[0];
    if(timeoutID && touch.identifier === touchID) {
        timeoutID = false;
        fire();
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;

    if(timeoutID && validTouch && distance(x, y, originalLocation.x, originalLocation.y) > MAX_MOVEMENT) {
        validTouch = false;
        clearTimeout(timeoutID);
        timeoutID = false;
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});