registerBehavior("press and hold", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 1000;
var radius = 40;
var validGesture = true;

var timeoutID;

var circle = new Path().circle(gesture.getStartXConstraint(),
                                gesture.getStartYConstraint(),
                                radius);
                                
gesture.downInside = circle;

gesture.on('satisfied', function() {
    validGesture = true;                
    timeoutID = setTimeout(function() { 
        timeoutID = false;
        fire();                   
    }, MIN_TIME_MILLISECONDS);
});

gesture.on('cross', circle, function() { 
    validGesture = false; 
});

gesture.on('unsatisfied', function() {
    if (validGesture === false || timeoutID) { 
        clearTimeout(timeoutID);  
        timeoutID = false;
        validGesture = false;
    }
});

});