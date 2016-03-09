registerBehavior("double tap count tap", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var timeout1,
    timeout2,
    timeout3,
    count = 0;

var touch2 = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var validTouch = true;
var touchEnded = false;
var timeoutID;


touch2.on('satisfied', function() {
   validTouch = true;
   count++;
   if (count === 1) {
        timeout1 = setTimeout(function() {
            validTouch = false;
        }, 200);
   }
   else if (count === 2) {
        clearTimeout(timeout1);
        valid
   }
   else if (count === 3) {
       
   }
});

function recursiveSetTimeout() {
    setTimeout(function() {
        if (validTouch) {
            fire();
            recursiveSetTimeout();
            return;
        }
        else {
            return;
        }
    }, 20);
}

});