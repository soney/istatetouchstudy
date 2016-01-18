registerBehavior("two down left or right", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var twoDown = new TouchCluster({
    numFingers: 2,
    greedy: true
});
var rectWidth = 250,
    rectHeight = 250;
var leftArea = new Path().rect(twoDown.getXConstraint().sub(rectWidth),
                                twoDown.getYConstraint().sub(rectHeight/2),
                                rectWidth,
                                rectHeight);

var rightArea = new Path().rect(twoDown.getXConstraint(),
                                twoDown.getYConstraint().sub(rectHeight/2),
                                rectWidth,
                                rectHeight);
                                
var backTouch = new TouchCluster({
    downInside: leftArea
});
var forwardTouch = new TouchCluster({
    downInside: rightArea
});

backTouch.on('satisfied', function() {
    fire();
});

forwardTouch.on('satisfied', function() {
    fire();
});

});