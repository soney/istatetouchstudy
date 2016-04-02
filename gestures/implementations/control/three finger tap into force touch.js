registerBehavior("three finger tap into force touch", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 300,
    validTouch = true,
    timeoutID,
    count = 0,
    ongoingTouches1 = new Array(),
    ongoingTouches2 = new Array(),
    originalLocations1 = new Array(),
    originalLocations2 = new Array(),
    MAX_MOVEMENT = 300,
    first;

onTouchStart(function(event) {
    validTouch = true;
    if (event.changedTouches.length != 3) {
        return;
    }
    count++;
    if (count === 3) {
        count = 1;
        originalLocations1 = new Array();
        originalLocations2 = new Array();
        ongoingTouches1 = new Array();
        ongoingTouches2 = new Array();
    }
    if (count === 1) {
        first = true;
        for (var i = 0; i < event.changedTouches.length; i++) {
            ongoingTouches1.push(event.changedTouches[i].identifier);
            var originalLocation1 = {
                x: event.changedTouches[i].clientX,
                y: event.changedTouches[i].clientY
            };
            originalLocations1.push(originalLocation1);
        }
        timeoutID = setTimeout(function() {
            validTouch = false;
        }, MAX_TIME_MILLISECONDS);
    }
    else if (count === 2) { 
        first = false;
        for (var j = 0; j < event.changedTouches.length; j++) {
            ongoingTouches1.push(event.changedTouches[j].identifier);
            var originalLocation2 = {
                x: event.changedTouches[j].clientX,
                y: event.changedTouches[j].clientY
            };
            originalLocations2.push(originalLocation2);
        }
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
    if(first) {
        for (var k = 0; k < event.changedTouches.length; k++) {
            if(timeoutID && validTouch && distance(x, y, originalLocations1[k].x, originalLocations1[k].y) > MAX_MOVEMENT) {
                validTouch = false;
                clearTimeout(timeoutID);
                timeoutID = false;
            }
        }
    }
    else {
        var force = true;
        for (var l = 0; l < event.changedTouches.length; l++) {
            if(validTouch && distance(x, y, originalLocations2[l].x, originalLocations2[l].y) > MAX_MOVEMENT) {
                validTouch = false;
            }
            if (event.changedTouches[l].force < 0.5) {
                force = false;
            }
        }
        if (force && validTouch) {
            validTouch = false;
            fire();
        }
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}
//not done

});