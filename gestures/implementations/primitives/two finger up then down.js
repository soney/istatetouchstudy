registerBehavior("two finger up then down", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 2,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 750;
var width = 200;
var height = 80;
var crossedUpper = false;
var crossedRight = false;
var crossedLeft = false;

var lower = new Path().moveTo(touch.getStartXConstraint().sub(100),
                            touch.getStartYConstraint().sub(40))
                      .horizontalLineTo(touch.getStartXConstraint().add(100));

var upper = new Path().moveTo(touch.getStartXConstraint().sub(100),
                            touch.getStartYConstraint().sub(120))
                      .horizontalLineTo(touch.getStartXConstraint().add(100));

var right = new Path().moveTo(touch.getStartXConstraint().add(100),
                            touch.getStartYConstraint().sub(120))
                        .verticalLineTo(touch.getStartYConstraint().add(40));

var left = new Path().moveTo(touch.getStartXConstraint().sub(100),
                            touch.getStartYConstraint().sub(120))
                        .verticalLineTo(touch.getStartYConstraint().add(40));

touch.downInside = lower;

touch.on('satisfied', function() {
   validTouch = true;      
   crossedUpper = false;
   crossedRight = false;
   crossedLeft = false;
   timeoutID = setTimeout(function() {
        validTouch = false;             
    }, MIN_TIME_MILLISECONDS);
});


touch.on('cross', upper, function() {
    crossedUpper = true;
});

touch.on('cross', right, function() {
    crossedRight = true;
});

touch.on('cross', left, function() {
    crossedLeft = true;
});

touch.on('cross', lower, function() {
    if (crossedUpper && !crossedRight && !crossedLeft && validTouch) {
        fire();
    }
});


});