registerBehavior("three finger left then right", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 3,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 1000;
var radius = touch.getRadiusConstraint();
var crossedUpper = false;
var crossedLower = false;
var crossedLeft = false;

var right = new Path().moveTo(touch.getStartXConstraint().sub(50),
                            touch.getStartYConstraint().sub(100))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var left = new Path().moveTo(touch.getStartXConstraint().sub(180),
                            touch.getStartYConstraint().sub(100))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var upper = new Path().moveTo(touch.getStartXConstraint().sub(180),
                           touch.getStartYConstraint().add(100))
                        .horizontalLineTo(touch.getStartXConstraint().add(40));

var lower = new Path().moveTo(touch.getStartXConstraint().sub(180),
                            touch.getStartYConstraint().sub(100))
                        .horizontalLineTo(touch.getStartXConstraint().add(40));

touch.on('satisfied', function() {  
   validTouch = true;   
   crossedUpper = false;
   crossedLower = false;
   crossedLeft = false;
   timeoutID = setTimeout(function() {
        validTouch = false;      
    }, MIN_TIME_MILLISECONDS);
});


touch.on('cross', left, function() {  
    crossedLeft = true;
});

touch.on('cross', upper, function() {
    crossedUpper = true;
});

touch.on('cross', lower, function() {
    crossedLower = true;
});

touch.on('cross', right, function() {
    if (crossedLeft && !crossedUpper && !crossedLower && validTouch) {
        fire();
    }
});





});