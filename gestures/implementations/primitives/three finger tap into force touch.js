registerBehavior("three finger tap into force touch", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch = new TouchCluster({
    numFingers: 3,
    greedy: true
});


var radius = 40;
var validTouch;
var count = 0;
var timeoutID;

var circle = new Path().circle(touch.getEndXConstraint(),
                                touch.getEndYConstraint(),
                                radius);


touch.on('satisfied', function() {  
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
       recursiveSetTimeout();
   }
});

touch.on('cross', circle, function() {
    validTouch = false;
});

function recursiveSetTimeout() {
    setTimeout(function() {
        if (touch.getForce() > 0.5 && validTouch) {
            fire();
            return;
        }
        else {
            recursiveSetTimeout();
            return;
        }
    }, 20);
}


});