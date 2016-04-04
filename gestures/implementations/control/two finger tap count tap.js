registerBehavior("two finger tap count tap", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 200,
    validTouch = true,
    bool1 = false,
    bool2 = false,
    timeoutID;

onTouchStart(function(event) {
    validTouch = true;
    if (event.changedTouches.length === 2) {
        bool1 = true;
        timeoutID = setTimeout(function() {
           validTouch = false;
        }, MAX_TIME_MILLISECONDS);
    }
    
    if (event.changedTouches.length === 1) {
        bool2 = true;
        validTouch = false;
    }
});

onTouchEnd(function(event) {
    if (bool1) {
        clearTimeout(timeoutID);
        recursiveSetTimeout();
    }
    if (bool2) {
        validTouch = false;
        bool1 = false;
        bool2 = false;
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