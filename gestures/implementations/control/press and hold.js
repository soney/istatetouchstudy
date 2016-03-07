registerBehavior("press and hold", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000, 
    MAX_MOVEMENT = 50,
    originalLocation,
    touchID,
    timeoutID;

onTouchStart(function(event) {
    var touch = event.changedTouches[0];
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY 
    };
    
    touchID = touch.identifier;
    timeoutID = setTimeout(function() {
        timeoutID = false;
        fire();       
    }, MIN_TIME_MILLISECONDS);
});

onTouchEnd(function(event) { 
    var touch = event.changedTouches[0];
    if(timeoutID && touch.identifier === touchID) {
        clearTimeout(timeoutID);
        timeoutID = false;
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;

    if(timeoutID && distance(x, y, originalLocation.x, originalLocation.y) > MAX_MOVEMENT) {
        clearTimeout(timeoutID); 
        timeoutID = false;
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});