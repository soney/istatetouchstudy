registerBehavior("three finger left then right", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 3,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 1000;
var radius = touch.getRadiusConstraint();
var bool1 = false;
var bool2 = false;
var bool3 = false;
var bool4 = false;

var right = new Path().moveTo(touch.getStartXConstraint().sub(50),
                            touch.getStartYConstraint().sub(100))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var left = new Path().moveTo(touch.getStartXConstraint().sub(180),
                            touch.getStartYConstraint().sub(100))
                        .verticalLineTo(touch.getStartYConstraint().add(100));

var upper = new Path().moveTo(touch.getStartXConstraint().sub(180),
                           touch.getStartYConstraint().add(100))
                        .horizontalLineTo(touch.getStartXConstraint().add(40));

var lower = new Path().moveTo(touch.getStartXConstraint().sub(180),
                            touch.getStartYConstraint().sub(100))
                        .horizontalLineTo(touch.getStartXConstraint().add(40));

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


touch.on('cross', left, function() {  
    bool1 = true;
});

touch.on('cross', upper, function() {
    bool2 = true;
});

touch.on('cross', lower, function() {
    bool3 = true;
});

touch.on('cross', right, function() {
    if (bool1) {
        bool4 = true;
    } 
});

touch.on('cross', right, function() {
    if (bool1 && !bool2 && !bool3 && bool4 && validTouch) {
        fire();
    }
});





});