registerBehavior("two finger press hold to increment", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 2,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var radius = touch.getRadiusConstraint();
//how to get start without letting it change
//does it matter if they move?
var validTouch = true;
var timeoutID;


var circle = new Path().circle(touch.getStartXConstraint(),
                                touch.getStartYConstraint(),
                                radius.add(20));
                                
var circle2 = new Path().circle(touch.getStartXConstraint(),
                                touch.getStartYConstraint(),
                                radius.sub(20));
                                
touch.downInside = circle;

touch.on('satisfied', function() {
    validTouch = true; 
    recursiveSetTimeout();
});

touch.on('cross', circle, function() {  
    validTouch = false;  
});

touch.on('cross', circle2, function() {
    validTouch = false;
})

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