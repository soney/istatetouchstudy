registerBehavior("two finger tap count tap", "control", function(onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, offTouchStart, offTouchMove, offTouchEnd, offTouchCancel, fire, begin, update, end) {

var MAX_TIME_MILLISECONDS = 200,
    validTouch = true,
    doubleTap = false,
    singleTap = false,
    timeoutID;

onTouchStart(function(event) {
    validTouch = true;
    if (event.changedTouches.length === 2) { //how much leeway is there for
            //double taps? should I account for taking a little bit of time
            //between the first and second tap?
        doubleTap = true;
        timeoutID = setTimeout(function() {
           validTouch = false;
        }, MAX_TIME_MILLISECONDS);
    }
    
    if (event.changedTouches.length === 1) {
        singleTap = true;
        validTouch = false;
    }
});

onTouchEnd(function(event) {
    if (doubleTap) {
        clearTimeout(timeoutID);
        recursiveSetTimeout();
    }
    if (singleTap) {
        validTouch = false;
        doubleTap = false;
        singleTap = false;
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