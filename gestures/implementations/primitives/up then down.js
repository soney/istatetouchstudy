registerBehavior("up then down", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 1000;
var radius = gesture.getRadiusConstraint();
var crossedUpper = false;
var crossedLower = false;
var crossedLeft = false;
var crossedRight = false;

var right = new Path().moveTo(gesture.getStartXConstraint().add(50),
                            gesture.getStartYConstraint().sub(150))
                        .verticalLineTo(gesture.getStartYConstraint().add(100));

var left = new Path().moveTo(gesture.getStartXConstraint().sub(50),
                            gesture.getStartYConstraint().sub(150))
                        .verticalLineTo(gesture.getStartYConstraint().add(100));

var upper = new Path().moveTo(gesture.getStartXConstraint().sub(50),
                            gesture.getStartYConstraint().sub(150))
                        .horizontalLineTo(gesture.getStartXConstraint().add(50));

var lower = new Path().moveTo(gesture.getStartXConstraint().sub(50),
                            gesture.getStartYConstraint().sub(70))
                        .horizontalLineTo(gesture.getStartXConstraint().add(50));

//gesture.downInside = right;

gesture.on('satisfied', function() {  
   validTouch = true;   
   crossedUpper = false;
   crossedLower = false;
   crossedLeft = false;
   crossedRight = false;
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
    crossedRight = true;
})

gesture.on('cross', right, function() {
    if (!crossedLeft && crossedUpper && !crossedRight && validTouch) {
        fire();
    }
});

});