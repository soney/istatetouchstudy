registerBehavior("three finger left then right", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 3,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;
var radius = gesture.getRadiusConstraint();
var width = 80;
var height = 180;
var crossedUpper = false;
var crossedLower = false;
var crossedLeft = false;

var right = new Path().rect(gesture.getStartXConstraint().sub(40),
                            gesture.getStartYConstraint().sub(90),//gesture.getStartYConstraint().sub(radius),
                            width,
                            height);

var left = new Path().rect(gesture.getStartXConstraint().sub(180),
                            gesture.getStartYConstraint().sub(90),
                            width,
                            height);

var upper = new Path().rect(gesture.getStartXConstraint().sub(250),
                            gesture.getStartYConstraint().add(90),
                            400,
                            10);

var lower = new Path().rect(gesture.getStartXConstraint().sub(250),
                            gesture.getStartYConstraint().sub(100),
                            400,
                            10);

gesture.downInside = right;

gesture.on('satisfied', function() {    // when the gesture begins,
   validTouch = true;                   // set the gesture as being valid
   crossedUpper = false;
   crossedRight = false;
   crossedLeft = false;
   timeoutID = setTimeout(function() {  // set a timer for the gesture
        validTouch = false;             // if gesture takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});



gesture.on('cross', left, function() {  // when the gesture leaves rect,
    crossedLeft = true;
});

gesture.on('cross', upper, function() {
    crossedUpper = true;
});

gesture.on('cross', lower, function() {
    crossedLower = true;
});

gesture.on('cross', lower, function() {
    if (crossedLeft && !crossedUpper && !crossedLower && validTouch) {
        fire();
    }
});





});