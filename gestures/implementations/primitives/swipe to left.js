registerBehavior("swipe to left", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var width = 250;
var height = 100;
var validGesture = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;

var left = new Path().moveTo(gesture.getStartXConstraint().sub(250),
                                gesture.getStartYConstraint().sub(50))
                                .verticalLineTo(gesture.getStartYConstraint().add(50));

var upper = new Path().moveTo(gesture.getStartXConstraint().sub(250),
                            gesture.getStartYConstraint().sub(50))
                            .horizontalLineTo(gesture.getStartXConstraint().add(20));
                            
var lower = new Path().moveTo(gesture.getStartXConstraint().sub(250),
                            gesture.getStartYConstraint().add(50))
                            .horizontalLineTo(gesture.getStartXConstraint().add(20));

var right = new Path().moveTo(gesture.getStartXConstraint().add(20),
                            gesture.getStartYConstraint().sub(50))
                            .verticalLineTo(gesture.getStartYConstraint().add(50));

gesture.on('satisfied', function() {    // when the gesture begins,
   validGesture = true;                 // set the gesture as valid
   timeoutID = setTimeout(function() {  // set a timer for the gesture
        validGesture = false;           // if gesture takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', upper, function() {
    validGesture = false;
});

gesture.on('cross', lower, function() {
    validGesture = false;
});

gesture.on('cross', right, function() {
    validGesture = false;
});

gesture.on('cross', left, function() {  // when the gesture leaves rect,
    if (validGesture) {                 // fire if the gesture is still valid
        fire();
    }
});

});