registerBehavior("three finger left then right", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 2000,
    MAX_MOVEMENT = 200,
    originalLocation,
    touchID,
    validTouch = true,
    bool = false;
var ongoingTouches = new Array(); 
var originalLocations = new Array();
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
    bool = false;
});

onTouchEnd(function(event) {
    if(validTouch && event.targetTouches.length === 3) {
        for (var i = 0; i < event.targetTouches.length; i++) {
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
            validTouch = false;
        }
        if (bool === false) {
            if (lastLocations[j].x < x) {
                bool = true;
            }
        }
        else if (bool === true) {
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