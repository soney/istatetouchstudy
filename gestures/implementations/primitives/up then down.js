registerBehavior("up then down", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 1,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 1000;
var crossedUpper = false;
var crossedLower = false;
var crossedLeft = false;
var crossedRight = false;

var right = new Path().moveTo(touch.getStartXConstraint().add(50),
                            touch.getStartYConstraint().sub(150))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var left = new Path().moveTo(touch.getStartXConstraint().sub(50),
                            touch.getStartYConstraint().sub(150))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var upper = new Path().moveTo(touch.getStartXConstraint().sub(50),
                            touch.getStartYConstraint().sub(150))
                        .horizontalLineTo(touch.getStartXConstraint().add(50));

var lower = new Path().moveTo(touch.getStartXConstraint().sub(50),
                            touch.getStartYConstraint().sub(70))
                        .horizontalLineTo(touch.getStartXConstraint().add(50));

touch.on('satisfied', function() {  
   validTouch = true;   
   crossedUpper = false;
   crossedLower = false;
   crossedLeft = false;
   crossedRight = false;
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
    crossedRight = true;
})

touch.on('unsatisfied', function() {
    if (!crossedLeft && crossedUpper && !crossedRight && validTouch) {
        fire();
    }
});

});