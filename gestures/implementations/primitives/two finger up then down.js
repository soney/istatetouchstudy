registerBehavior("two finger up then down", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 2,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;
var radius = gesture.getRadiusConstraint();
var width = 180;
var height = 80;
var crossedUpper = false;
var crossedRight = false;
var crossedLeft = false;

var lower = new Path().rect(gesture.getStartXConstraint().sub(90),
                            gesture.getStartYConstraint().sub(40),//gesture.getStartYConstraint().sub(radius),
                            width,
                            height);

var upper = new Path().rect(gesture.getStartXConstraint().sub(90),
                            gesture.getStartYConstraint().sub(180),
                            width,
                            height);

var right = new Path().rect(gesture.getStartXConstraint().add(90),
                            gesture.getStartYConstraint().sub(250),
                            10,
                            400);

var left = new Path().rect(gesture.getStartXConstraint().sub(100),
                            gesture.getStartYConstraint().sub(250),
                            10,
                            400);

gesture.downInside = lower;

gesture.on('satisfied', function() {    // when the gesture begins,
   validTouch = true;                   // set the gesture as being valid
   crossedUpper = false;
   crossedRight = false;
   crossedLeft = false;
   timeoutID = setTimeout(function() {  // set a timer for the gesture
        validTouch = false;             // if gesture takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});



gesture.on('cross', upper, function() {  // when the gesture leaves rect,
    crossedUpper = true;
});

gesture.on('cross', right, function() {
    crossedRight = true;
});

gesture.on('cross', left, function() {
    crossedLeft = true;
});

gesture.on('cross', lower, function() {
    if (crossedUpper && !crossedRight && !crossedLeft && validTouch) {
        fire();
    }
});





});