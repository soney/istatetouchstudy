registerBehavior("two finger down then left", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 2,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 6000;
var radius = 40;
var validTouch = true;
var timeoutID;


var right = new Path().moveTo(gesture.getStartXConstraint().add(40),
                            gesture.getStartYConstraint().sub(30))
                        .verticalLineTo(gesture.getStartYConstraint().add(250));

var left = new Path().moveTo(gesture.getStartXConstraint().sub(40),
                            gesture.getStartYConstraint().sub(30))
                        .verticalLineTo(gesture.getStartYConstraint().add(100));

var upper = new Path().moveTo(gesture.getStartXConstraint().sub(40),
                            gesture.getStartYConstraint().add(100))
                        .horizontalLineTo(gesture.getStartXConstraint().sub(200));

var lower = new Path().moveTo(gesture.getStartXConstraint().add(40),
                            gesture.getStartYConstraint().add(250))
                        .horizontalLineTo(gesture.getStartXConstraint().sub(200));


gesture.on('satisfied', function() {
    validTouch = true; 
    timeoutID = setTimeout(function() { 
        validTouch = false;  
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', right, function() {  
    validTouch = false;  
});
gesture.on('cross', left, function() {  
    validTouch = false;  
});
gesture.on('cross', upper, function() {  
    validTouch = false;  
});
gesture.on('cross', lower, function() {  
    validTouch = false;  
});

gesture.on('unsatisfied', function() {
    if (validTouch) { 
        fire();   
    }
});

});