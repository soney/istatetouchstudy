registerBehavior("tap into force touch", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture1 = new TouchCluster({
    numFingers: 1,
    greedy: true
});


var radius = 40;
var validTouch;
var count = 0;

var circle = new Path().circle(gesture1.getEndXConstraint(),
                                gesture1.getEndYConstraint(),
                                radius);


gesture1.on('satisfied', function() {  
   count++;
   if (count === 3) {
       count = 1;
   }
   if (count === 1) {
       validTouch = true;
   }
});

gesture1.on('cross', circle, function() {
    validTouch = false;
});

gesture1.on('unsatisfied', function() {
    if (validTouch && count === 2 && gesture1.getForceConstraint() !== 0) {
        fire();
    }
});
//not done


});