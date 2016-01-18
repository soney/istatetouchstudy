registerBehavior("press and hold", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var tc = new TouchCluster({
    numFingers: 1
});
var path = new Path()
                    .moveTo(tc.getStartXConstraint(), 0)
                    .verticalLineTo(900);

});