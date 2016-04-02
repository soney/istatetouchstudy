registerBehavior("two finger press hold to increment", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 2,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var radius;
var validTouch = true;
var timeoutID;


var circle = new Path().circle(touch.getStartXConstraint(),
                                touch.getStartYConstraint(),
                                40);

touch.downInside = circle;

touch.on('satisfied', function() {
    validTouch = true; 
    radius = touch.getRadius();
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
        console.log(radius + ", " + touch.getRadius());
        if (validTouch && (radius < touch.getRadius() + 20) && (radius > touch.getRadius() - 20)) {
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