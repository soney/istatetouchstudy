registerBehavior("three finger left then right", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000,
    MAX_MOVEMENT = 100,
    originalLocation,
    touchID,
    validTouch = true,
    movingRight = false;
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
    movingRight = false;
});

onTouchEnd(function(event) {
    if(validTouch && event.targetTouches.length === 3) { // ensures only 3 touches present
        for (var i = 0; i < event.targetTouches.length; i++) {
            // make sure it's ending roughly where it started (or past)
            var x = ongoingTouches[i].clientX;
            var y = ongoingTouches[i].clientY;
            if (x <= originalLocations[i].x) {
                fire();
            }
        }
    }
    if (validTouch) {
        fire();
    }
});

onTouchMove(function(event) {
    for (var j = 0; j < ongoingTouches.length; j++) {
        var x = ongoingTouches[j].clientX;
        var y = ongoingTouches[j].clientY;
        if (validTouch && distance(y, originalLocations[j].y) > MAX_MOVEMENT) {
            validTouch = false; // at least one of the touches moved too much
        }
        if (movingRight === false) {
            if (lastLocations[j].x < x) {
                movingRight = true;
            }
        }
        else if (movingRight === true) {
            if (lastLocations[j].x > x) {
                validTouch = false;
            }
        }
        lastLocations[j].x = x;
    }
});

function distance(x1, x2) {
    return Math.sqrt(Math.pow(x1-x2, 2));
}

});