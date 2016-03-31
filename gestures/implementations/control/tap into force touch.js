registerBehavior("tap into force touch", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 200,
    validTouch = true,
    timeoutID,
    count = 0,
    touchID1,
    touchID2;

onTouchStart(function(event) {
    validTouch = true;
    count++;
    
    if (count === 1) {
        touchID1 = event.changedTouches[0];
        timeoutID = setTimeout(function() {
            validTouch = false;
        }, MAX_TIME_MILLISECONDS);
    }
    else if (count === 2) { 
        touchID2 = event.changedTouches[0];
        if (validTouch) {
            clearTimeout(timeoutID);
        }
    }
    else if (count === 3) {
        count = 0;
        validTouch = false;
    }
});

onTouchMove(function(event) {
    var touch = event.changedTouches[0],
        x = touch.clientX,
        y = touch.clientY;
    if(touch.identifier === touchID1) {
        if(timeoutID && validTouch && distance(x, y, originalLocation.x, originalLocation.y) > MAX_MOVEMENT) {
            validTouch = false;
            clearTimeout(timeoutID);
            timeoutID = false;
        }
    }
    else if(touch.identifier === touchID2) {
        if(validTouch && distance(x, y, originalLocation.x, originalLocation.y) > MAX_MOVEMENT) {
            validTouch = false;
        }
        if (touch.force !== 0) {
            fire();
        }
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}
//not done

});