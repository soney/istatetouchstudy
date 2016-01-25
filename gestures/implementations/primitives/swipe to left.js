registerBehavior("swipe to left", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var width = 500;
var height = 100;
var validGesture = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;

var rect = new Path().rect(gesture.getStartXConstraint().sub(250), // create a rectangle
                            gesture.getStartYConstraint().sub(50),
                            width,
                            height);
                                
gesture.downInside = rect;    // set rect as the starting area for the gesture

gesture.on('satisfied', function() {    // when the gesture begins,
   validGesture = true;                 // set the gesture as valid
   timeoutID = setTimeout(function() {  // set a timer for the gesture
        validGesture = false;           // if gesture takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', rect, function() {  // when the gesture leaves rect,
    if (validGesture) {                 // fire if the gesture is still valid
        fire();
    }
});

});