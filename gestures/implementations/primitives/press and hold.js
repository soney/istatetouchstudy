registerBehavior("press and hold", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 1000;
var radius = 40;
var validTouch = true;

var timeoutID;

var circle = new Path().circle(touch.getStartXConstraint(),
                                touch.getStartYConstraint(),
                                radius);
                                
touch.downInside = circle;

touch.on('satisfied', function() {
    validTouch = true;                
    timeoutID = setTimeout(function() { 
        timeoutID = false;
        fire();                   
    }, MIN_TIME_MILLISECONDS);
});

touch.on('cross', circle, function() { 
    validTouch = false; 
});

touch.on('unsatisfied', function() {
    if (validTouch === false || timeoutID) { 
        clearTimeout(timeoutID);  
        timeoutID = false;
        validTouch = false;
    }
});

});