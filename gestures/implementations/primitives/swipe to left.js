registerBehavior("swipe to left", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var tc = new TouchCluster({
    numFingers: 1
});
var path = new Path()
                    .moveTo(tc.getStartXConstraint().sub(300), 0)
                    .verticalLineTo(900);
tc.on('cross', path, function() {
   fire();
});

});