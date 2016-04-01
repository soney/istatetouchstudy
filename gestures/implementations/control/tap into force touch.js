registerBehavior("tap into force touch", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 200,
    validTouch = true,
    timeoutID,
    count = 0,
    touchID1,
    touchID2,
    originalLocation1,
    originalLocation2,
    MAX_MOVEMENT = 300;

onTouchStart(function(event) {
    validTouch = true;
    count++;
    if (count === 3) {
        count = 1;
    }
    if (count === 1) {
        touchID1 = event.changedTouches[0].identifier;
        timeoutID = setTimeout(function() {
            validTouch = false;
        }, MAX_TIME_MILLISECONDS);
        originalLocation1 = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        };
    }
    else if (count === 2) { 
        touchID2 = event.changedTouches[0].identifier;
        if (validTouch) {
            clearTimeout(timeoutID);
        }
        originalLocation2 = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        };
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
    if(touch.identifier === touchID1) {
        if(timeoutID && validTouch && distance(x, y, originalLocation1.x, originalLocation1.y) > MAX_MOVEMENT) {
            validTouch = false;
            clearTimeout(timeoutID);
            timeoutID = false;
        }
    }
    else if(touch.identifier === touchID2) {
        console.log(touch.force);
        if(validTouch && distance(x, y, originalLocation2.x, originalLocation2.y) > MAX_MOVEMENT) {
            validTouch = false;
        }
        else if (touch.force > 0.5) {
            fire();
        }
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}
//not done

});