registerBehavior("tap", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

onTouchStart(function(event) { 
    var touch = event.changedTouches[0]; 
    originalLocation = {
        x: touch.clientX,
        y: touch.clientY
    };
    
    touchID = touch.identifier; // the unique identifier for the touch
    tapID = true;
});

onTouchEnd(function(event) { 
    var touch = event.changedTouches[0];
    if(tapID && touch.identifier === touchID) {
        fire();
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;

    if(tapID && distance(x, originalLocation.x, y, originalLocation.y) > MAX_MOVEMENT) { 
        tapID = false;
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});