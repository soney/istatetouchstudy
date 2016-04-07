registerBehavior("double tap count tap", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 200,
    validTouch = true,
    timeoutID,
    count = 0,
    doubleTap;

onTouchStart(function(event) {
    validTouch = true;
    count++;
    if (count === 2) { 
        doubleTap = true;
        if (validTouch === true) {
            clearTimeout(timeoutID);
            recursiveSetTimeout();
        }
    }
    if (count === 1) {
        timeoutID = setTimeout(function() {
            validTouch = false;
        }, MAX_TIME_MILLISECONDS);
    }
    if (count === 3) {
        count = 0;
        validTouch = false;
    }
});

onTouchEnd(function(event) {
    if (count === 2) {
        clearTimeout(timeoutID);
        recursiveSetTimeout();
    }
    if (count === 1 || count === 3) {
        validTouch = false;
    }
});

function recursiveSetTimeout() {
    setTimeout(function() {
        if (validTouch) {
            fire();
            recursiveSetTimeout();
            return;
        }
        else {
            return;
        }
    }, 20);
}

});
