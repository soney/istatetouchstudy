registerBehavior("force touch", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var radius = 40;
var validTouch = true;


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

function recursiveSetTimeout() {
    setTimeout(function() {
        if (touch.getForce() > 0.5 && validTouch) {
            fire();
            return;
        }
        else {
            recursiveSetTimeout();
            return;
        }
    }, 20);
}

});