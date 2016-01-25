registerBehavior("tap", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var radius = 40;
var validTouch = true;
var timeoutID;


var circle = new Path().circle(touch.getStartXConstraint(), // create a circle
                                touch.getStartYConstraint(),
                                radius);
                                
touch.downInside = circle;  // set circle as the starting area for the touch

touch.on('satisfied', function() {      // whe the touch begins,
    validTouch = true;                  // set the touch as being valid
    timeoutID = setTimeout(function() { // start a timer
        validTouch = false;             // if touch takes too long, it's no longer valid
    }, MIN_TIME_MILLISECONDS);
});

touch.on('cross', circle, function() {  // if touch leaves the circle,
    validTouch = false;                 // it's no longer valid
});

touch.on('unsatisfied', function() {
    if (validTouch) {                   // if touch is still valid,
        fire();                         // then fire
    }
});

});