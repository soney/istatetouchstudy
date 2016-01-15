registerBehavior("press and hold", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var tc = new TouchCluster({
    numFingers: 1
});
var path = new Path()
                    .moveTo(250, 0)
                    .verticalLineTo(900);

tc.on('satisfied', function() {
    console.log(arguments);
});

});