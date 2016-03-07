registerBehavior("two finger tap count tap", "primitives", function(TouchCluster, Path, fire, begin, update, end) {

var touch1 = new TouchCluster({
    numFingers: 2,
    greedy: true
});

var touch2 = new TouchCluster({
    numFingers: 1,
    greedy: true
});

var MIN_TIME_MILLISECONDS = 500;
var validTouch = true;
var touchEnded = false;
var timeoutID;

touch1.on('satisfied', function() {
    validTouch = true; 
    setTimeout(function() { 
        if (!touchEnded) {
            validTouch = false;  
        }
    }, MIN_TIME_MILLISECONDS);
});

touch1.on('unsatisfied', function() {
    if (validTouch) {
        touchEnded = true;
        clearTimeout();
        recursiveSetTimeout();
    }
});

touch2.on('satisfied', function() {
   validTouch = false; 
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