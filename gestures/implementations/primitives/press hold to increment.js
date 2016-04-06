registerBehavior("press hold to increment", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 1,
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
    recursiveSetTimeout();
});

touch.on('cross', circle, function() {  
    validTouch = false;  
});

touch.on('unsatisfied', function() {
    validTouch = false;
});

function recursiveSetTimeout() {
    setTimeout(function() {
        if (validTouch) {
            fire();
            recursiveSetTimeout();
            return;
        }
        else {
            return;
        }
    }, 20);
}

});