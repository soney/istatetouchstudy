registerBehavior("press and hold", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var tc = new TouchCluster({
    numFingers: 2
});
var path = new Path()
                    .moveTo(tc.getXConstraint(), 0)
                    .verticalLineTo(900);

tc.on('satisfied', function() {
  //  console.log(arguments);
});

});