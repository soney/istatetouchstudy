registerBehavior("swipe up", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;

var upper = new Path().moveTo(gesture.getStartXConstraint().sub(40),
                                gesture.getStartYConstraint().sub(175))
                            .horizontalLineTo(gesture.getStartXConstraint().add(40));
                                
var left = new Path().moveTo(gesture.getStartXConstraint().sub(40),
                            gesture.getStartYConstraint().sub(175))
                            .verticalLineTo(gesture.getStartYConstraint().add(20));
                            
var right = new Path().moveTo(gesture.getStartXConstraint().add(40),
                            gesture.getStartYConstraint().sub(175))
                            .verticalLineTo(gesture.getStartYConstraint().add(20));

var lower = new Path().moveTo(gesture.getStartXConstraint().sub(40),
                            gesture.getStartYConstraint().add(20))
                            .horizontalLineTo(gesture.getStartXConstraint().add(40));

gesture.on('satisfied', function() {    // when the gesture begins,
   validTouch = true;                   // set the gesture as being valid
   timeoutID = setTimeout(function() {  // set a timer for the gesture
        validTouch = false;             // if gesture takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', right, function() {
    validTouch = false;
});

gesture.on('cross', left, function() {
    validTouch = false;
});

gesture.on('cross', lower, function() {
    validTouch = false;
});

gesture.on('cross', upper, function() {  // when the gesture leaves rect,
    if (validTouch) {                   // fire if the gesture is still valid
        fire();
    }
});

});