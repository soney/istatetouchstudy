registerBehavior("two down left or right", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000,
    MAX_MOVEMENT = 50,
    originalLocation,
    touchID,
    validTouch = true;
var ongoingTouches = new Array(); // an array of all the touches
var originalLocations = new Array(); // an array of all the touches' locations

onTouchStart(function(event) { 
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        ongoingTouches.push(touch);
        originalLocation = {
            x: touch.clientX,
            y: touch.clientY
        };
        originalLocations.push(originalLocation);
        
    }
    validTouch = true;
});

onTouchEnd(function(event) { 
    if(validTouch && event.targetTouches.length === 3) { // ensures only 3 touches present
        for (var i = 0; i < event.targetTouches.length; i++) {
            // if left
            if (event.changedTouches[0].clientX < event.targetTouches[i].clientX) {
                fire();
            }
            // if right
            if (event.changedTouches[0].clientY < event.targetTouches[i].clientX) {
                fire();
            }
        }
        
    }
});

onTouchMove(function(event) {
    for (var j = 0; j < ongoingTouches.length; j++) {
        var x = ongoingTouches[j].clientX;
        var y = ongoingTouches[j].clientY;
        if (validTouch && distance(x, y, originalLocations[j].x, originalLocations[j].y) > MAX_MOVEMENT) {
            validTouch = false; // at least one of the touches moved too much
        }
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});