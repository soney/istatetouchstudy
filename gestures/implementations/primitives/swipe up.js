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

var validArea = new Path().rect(gesture.getStartXConstraint().sub(50),
                                gesture.getStartYConstraint().sub(675),
                                width,
                                height);
                                
var right = new Path().rect(gesture.getStartXConstraint().sub(100),
                            gesture.getStartYConstraint().sub(400),
                            50,
                            400);
                            
var left = new Path().rect(gesture.getStartXConstraint().add(50),
                            gesture.getStartYConstraint().sub(400),
                            50,
                            400);

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
})

gesture.on('cross', validArea, function() {  // when the gesture leaves rect,
    if (validTouch) {                   // fire if the gesture is still valid
        fire();
    }
});

});