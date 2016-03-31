registerBehavior("force touch", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000, 
    MAX_MOVEMENT = 50,
    originalLocation,
    touchID,
    validTouch;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY 
    };
    validTouch = true;
    touchID = touch.identifier;
});

onTouchEnd(function(event) { 
    var touch = event.changedTouches[0];
    if(validTouchtID && touch.identifier === touchID) {
        fire();
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;

    if(validTouch && distance(x, y, originalLocation.x, originalLocation.y) > MAX_MOVEMENT) {
        validTouch = false;
    }
    if(validTouch && touch.webkitForce !== 0) {
        fire();
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});