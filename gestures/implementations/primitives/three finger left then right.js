registerBehavior("three finger left then right", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 3,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 1000;
var radius = gesture.getRadiusConstraint();
var crossedUpper = false;
var crossedLower = false;
var crossedLeft = false;

var right = new Path().moveTo(gesture.getStartXConstraint().sub(50),
                            gesture.getStartYConstraint().sub(100))
                        .verticalLineTo(gesture.getStartYConstraint().add(100));

var left = new Path().moveTo(gesture.getStartXConstraint().sub(180),
                            gesture.getStartYConstraint().sub(100))
                        .verticalLineTo(gesture.getStartYConstraint().add(100));

var upper = new Path().moveTo(gesture.getStartXConstraint().sub(180),
                            gesture.getStartYConstraint().add(100))
                        .horizontalLineTo(gesture.getStartXConstraint().add(40));

var lower = new Path().moveTo(gesture.getStartXConstraint().sub(180),
                            gesture.getStartYConstraint().sub(100))
                        .horizontalLineTo(gesture.getStartXConstraint().add(40));

//gesture.downInside = right;

gesture.on('satisfied', function() {  
   validTouch = true;   
   crossedUpper = false;
   crossedLower = false;
   crossedLeft = false;
   timeoutID = setTimeout(function() {
        validTouch = false;      
    }, MIN_TIME_MILLISECONDS);
});



gesture.on('cross', left, function() {  
    crossedLeft = true;
});

gesture.on('cross', upper, function() {
    crossedUpper = true;
});

gesture.on('cross', lower, function() {
    crossedLower = true;
});

gesture.on('cross', right, function() {
    if (crossedLeft && !crossedUpper && !crossedLower && validTouch) {
        fire();
    }
});





});