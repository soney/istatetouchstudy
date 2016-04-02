registerBehavior("swipe to left", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 500;

var left = new Path().moveTo(touch.getStartXConstraint().sub(250),
                                touch.getStartYConstraint().sub(50))
                                .verticalLineTo(touch.getStartYConstraint().add(50));

var upper = new Path().moveTo(touch.getStartXConstraint().sub(250),
                            touch.getStartYConstraint().sub(50))
                            .horizontalLineTo(touch.getStartXConstraint().add(20));
                            
var lower = new Path().moveTo(touch.getStartXConstraint().sub(250),
                            touch.getStartYConstraint().add(50))
                            .horizontalLineTo(touch.getStartXConstraint().add(20));

var right = new Path().moveTo(touch.getStartXConstraint().add(20),
                            touch.getStartYConstraint().sub(50))
                            .verticalLineTo(touch.getStartYConstraint().add(50));

touch.on('satisfied', function() {
   validTouch = true;      
   timeoutID = setTimeout(function() {
        validTouch = false; 
    }, MIN_TIME_MILLISECONDS);
});

touch.on('cross', upper, function() {
    validTouch = false;
});

touch.on('cross', lower, function() {
    validTouch = false;
});

touch.on('cross', right, function() {
    validTouch = false;
});

touch.on('cross', left, function() { 
    if (validTouch) {  
        fire();
    }
});

});