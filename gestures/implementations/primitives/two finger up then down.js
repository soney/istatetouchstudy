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
var bool1 = false;
var bool2 = false;
var bool3 = false;
var bool4 = false;

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
   bool1 = false;
   bool2 = false;
   bool3 = false;
   bool4 = false;
   timeoutID = setTimeout(function() {
        validTouch = false;             
    }, MIN_TIME_MILLISECONDS);
});


touch.on('cross', upper, function() {
    bool1 = true;
});

touch.on('cross', right, function() {
    bool2 = true;
});

touch.on('cross', left, function() {
    bool3 = true;
});

touch.on('cross', lower, function() {
    if (bool1 === true) {
        bool4 = true;
    }
});

touch.on('cross', lower, function() {
    if (bool1 && !bool2 && !bool3 && bool4 && validTouch) {
        fire();
    }
});


});