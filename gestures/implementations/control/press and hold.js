registerBehavior("press and hold", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000, // wait 1000 milliseconds
    MAX_MOVEMENT = 50, // make sure the finger doesnt move more than
                        //50 pixes from the original spot
    originalLocation,
    touchID,
    timeoutID;

onTouchStart(function(event) { // when the user presses a finger down...
    var touch = event.changedTouches[0]; // event.changedTouches is all of the 
                                    // touch information affected by this event
    originalLocation = {
        x: touch.clientX, // clientX is the x location of the touch
        y: touch.clientY // clientY is the y location
    };
    
    touchID = touch.identifier; // the unique identifier for the touch
    timeoutID = setTimeout(function() { // start a timer
        timeoutID = false;
        fire();                         // to fire the event
    }, MIN_TIME_MILLISECONDS);
});

onTouchEnd(function(event) { // if the user releases the touch before the timeout...
    var touch = event.changedTouches[0];
    if(timeoutID && touch.identifier === touchID) {
        clearTimeout(timeoutID); // then cancel the firing timeout
        timeoutID = false;
    }
});

onTouchMove(function(event) { // check if the finger moves too far to be a press+hold
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;

    if(timeoutID && distance(x, originalLocation.x, y, originalLocation.y) > MAX_MOVEMENT) { // we're waiting for a hold event
        clearTimeout(timeoutID); // then cancel the firing timeout
        timeoutID = false;
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});