registerBehavior("two finger up then down", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000,
    MAX_MOVEMENT = 100,
    originalLocation,
    touchID,
    validTouch = true,
    movingDown = false;
var ongoingTouches = new Array(); // an array of all the touches
var originalLocations = new Array(); // an array of all the touches' locations
var lastLocations = new Array();

onTouchStart(function(event) {
    ongoingTouches = new Array();
    originalLocations = new Array();
    lastLocations = new Array();
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        ongoingTouches.push(touch);
        originalLocation = {
            x: touch.clientX,
            y: touch.clientY
        };
        originalLocations.push(originalLocation);
        lastLocations.push(originalLocation);
    }
    validTouch = true;
    movingDown = false;
});

onTouchEnd(function(event) {
    if(validTouch && event.targetTouches.length === 2) { // ensures only 2 touches present
        for (var i = 0; i < event.targetTouches.length; i++) {
            // make sure it's ending roughly where it started (or past)
            var x = ongoingTouches[i].clientX;
            var y = ongoingTouches[i].clientY;
            if (y <= originalLocations[i].y) {
                fire();
            }
        }
    }
});

onTouchMove(function(event) {
    for (var j = 0; j < ongoingTouches.length; j++) {
        var x = ongoingTouches[j].clientX;
        var y = ongoingTouches[j].clientY;
        if (validTouch && distance(x, originalLocations[j].x) > MAX_MOVEMENT) {
            validTouch = false; // at least one of the touches moved too much
        }
        if (movingDown === false) {
            if (lastLocations[j].y < y) {
                movingDown = true;
            }
        }
        else if (movingDown === true) {
            if (lastLocations[j].y > y) {
                validTouch = false;
            }
        }
        lastLocations[j].y = y;
    }
});

function distance(x1, x2) {
    return Math.sqrt(Math.pow(x1-x2, 2));
}

});