registerBehavior("two finger right then up", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 2,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
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
        validTouch = false;  
    }, MIN_TIME_MILLISECONDS);
});

touch.on('cross', circle, function() {  
    validTouch = false;  
});

touch.on('unsatisfied', function() {
    if (validTouch) { 
        fire();   
    }
});

});