registerBehavior("press and hold", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 1000;
var radius = 40;
var validGesture = true;

var timeoutID;

var circle = new Path().circle(gesture.getStartXConstraint(),     // create a circle for the gesture
                                gesture.getStartYConstraint(),
                                radius);
                                
gesture.downInside = circle;

gesture.on('satisfied', function() {
    validGesture = true;                // start with the gesture being valid
    timeoutID = setTimeout(function() { // set a timeout
        timeoutID = false;
        fire();                         // if gesture lasts MIN_TIME_MILLISECONDS, then fire
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', circle, function() {    // if gesture moves outside the circle,
    validGesture = false;                   // gesture is no longer valid
});

gesture.on('unsatisfied', function() {
    if (validGesture === false || timeoutID) {  // if touch is not valid or the gesture ended before timeout,
        clearTimeout(timeoutID);                // then clear the timeout (and not fire)
        timeoutID = false;
        validGesture = false;
    }
});

});