registerBehavior("two finger force touch", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MIN_TIME_MILLISECONDS = 1000, 
    MAX_MOVEMENT = 50,
    originalLocation1,
    originalLocation2,
    touchID1,
    touchID2,
    validTouch;

onTouchStart(function(event) {
    var touch1 = event.changedTouches[0];
    var touch2 = event.changedTouches[1];
    originalLocation1 = {
        x: touch1.clientX,
        y: touch1.clientY 
    };
    originalLocation2 = {
        x: touch2.clientX,
        y: touch2.clientY
    };
    validTouch = true;
    touchID1 = touch1.identifier;
    touchID2 = touch2.identifier;
});


onTouchMove(function(event) {
    var force = true;
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i],
            x = touch.clientX,
            y = touch.clientY;
        if (touch.identifier === touchID1 && validTouch && distance(x, y, originalLocation1.x, originalLocation1.y) > MAX_MOVEMENT) {
            validTouch = false;
        }
        if (touch.identifier === touchID2 && validTouch && distance(x, y, originalLocation2.x, originalLocation2.y) > MAX_MOVEMENT) {
            validTouch = false;
        }
        if (touch.force < 0.5) {
            force = false;
        }
    }
    console.log(touch.force);
    if(validTouch && force) {
        fire();
    }
});

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

});