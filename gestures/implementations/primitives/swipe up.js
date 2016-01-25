registerBehavior("swipe up", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var width = 100;
var height = 500;
var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;

var rect = new Path().rect(gesture.getStartXConstraint().sub(50),   // create a rectangle rect
                            gesture.getStartYConstraint().sub(175),
                            width,
                            height);

gesture.downInside = rect;      // set rect as the starting area for the gesture

gesture.on('satisfied', function() {    // when the gesture begins,
   validTouch = true;                   // set the gesture as being valid
   timeoutID = setTimeout(function() {  // set a timer for the gesture
        validTouch = false;             // if gesture takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', rect, function() {  // when the gesture leaves rect,
    if (validTouch) {                   // fire if the gesture is still valid
        fire();
    }
});

});