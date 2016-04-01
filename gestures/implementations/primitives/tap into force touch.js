registerBehavior("tap into force touch", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var gesture1 = new TouchCluster({
    numFingers: 1,
    greedy: true
});


var radius = 40;
var validTouch;
var count = 0;
var timeoutID;

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
       timeoutID = setTimeout(function() {
           console.log("timeout");
           validTouch = false;
       }, 600);
   }
   if (count === 2) {
       clearTimeout(timeoutID);
       recursiveCheck();
   }
});

gesture1.on('cross', circle, function() {
    validTouch = false;
});

function recursiveCheck() {
    setTimeout(function() {
        //console.log("inside recursive check");
        if (gesture1.getForce() > 0.5 && validTouch) {
            fire();
            return;
        }
        else {
            recursiveCheck();
            return;
        }
    }, 20);
}


});