registerBehavior("two finger down then left", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 2,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 6000;
var radius = 40;
var validTouch = true;
var timeoutID;


var right = new Path().moveTo(touch.getStartXConstraint().add(40),
                            touch.getStartYConstraint().sub(30))
                        .verticalLineTo(touch.getStartYConstraint().add(250));

var left = new Path().moveTo(touch.getStartXConstraint().sub(40),
                            touch.getStartYConstraint().sub(30))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var upper = new Path().moveTo(touch.getStartXConstraint().sub(40),
                            touch.getStartYConstraint().add(100))
                        .horizontalLineTo(touch.getStartXConstraint().sub(200));

var lower = new Path().moveTo(touch.getStartXConstraint().add(40),
                            touch.getStartYConstraint().add(250))
                        .horizontalLineTo(touch.getStartXConstraint().sub(200));


touch.on('satisfied', function() {
    validTouch = true; 
    timeoutID = setTimeout(function() { 
        validTouch = false;  
    }, MIN_TIME_MILLISECONDS);
});

touch.on('cross', right, function() {  
    validTouch = false;  
});
touch.on('cross', left, function() {  
    validTouch = false;  
});
touch.on('cross', upper, function() {  
    validTouch = false;  
});
touch.on('cross', lower, function() {  
    validTouch = false;  
});

touch.on('unsatisfied', function() {
    if (validTouch) { 
        fire();   
    }
});

});