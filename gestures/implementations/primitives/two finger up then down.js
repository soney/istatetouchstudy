registerBehavior("two finger up then down", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture = new TouchCluster({
    numFingers: 2,
    greedy: true
});


var validTouch = true;
var timeoutID;
var MIN_TIME_MILLISECONDS = 750;
var radius = gesture.getRadiusConstraint();
var width = 200;
var height = 80;
var crossedUpper = false;
var crossedRight = false;
var crossedLeft = false;

var lower = new Path().moveTo(gesture.getStartXConstraint().sub(100),
                            gesture.getStartYConstraint().sub(40))
                      .horizontalLineTo(gesture.getStartXConstraint().add(100));

var upper = new Path().moveTo(gesture.getStartXConstraint().sub(100),
                            gesture.getStartYConstraint().sub(120))
                      .horizontalLineTo(gesture.getStartXConstraint().add(100));

var right = new Path().moveTo(gesture.getStartXConstraint().add(100),
                            gesture.getStartYConstraint().sub(120))
                        .verticalLineTo(gesture.getStartYConstraint().add(40));

var left = new Path().moveTo(gesture.getStartXConstraint().sub(100),
                            gesture.getStartYConstraint().sub(120))
                        .verticalLineTo(gesture.getStartYConstraint().add(40));

gesture.downInside = lower;

gesture.on('satisfied', function() {
   validTouch = true;      
   crossedUpper = false;
   crossedRight = false;
   crossedLeft = false;
   timeoutID = setTimeout(function() {
        validTouch = false;             
    }, MIN_TIME_MILLISECONDS);
});



gesture.on('cross', upper, function() {
    crossedUpper = true;
    console.log('crossed upper');
});

gesture.on('cross', right, function() {
    crossedRight = true;
    console.log('crossed right');
});

gesture.on('cross', left, function() {
    crossedLeft = true;
    console.log('crossed left');
});

gesture.on('cross', lower, function() {
    console.log('crossed lower');
    if (crossedUpper && !crossedRight && !crossedLeft && validTouch) {
        fire();
    }
});





});