registerBehavior("double tap count tap", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var timeoutID,
    count = 0;

var touch = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var validTouch = true;
var touchEnded = false;
var timeoutID;


touch.on('satisfied', function() {
   validTouch = true;
   count++;
   if (count === 1) {
        timeoutID = setTimeout(function() {
            validTouch = false;
        }, 200);
   }
   else if (count === 2) {
        clearTimeout(timeoutID);
        recursiveCheck();
   }
   if (count === 3) {
       validTouch = false;
       count = 0;
   }
});

function recursiveCheck() {
    setTimeout(function() {
        if (validTouch) {
            fire();
            recursiveCheck();
            return;
        }
        else {
            return;
        }
    }, 20);
}

});