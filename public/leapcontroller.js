

var readGesture = true;

Leap.loop(function(frame) {
  if (frame.gestures.length && readGesture) {
    var gesture = frame.gestures[0];

    console.log(gesture.type)
    switch (gesture.type){
          case "circle":
            var clockwise = false;
            var pointableID = gesture.pointableIds[0];
            var direction = frame.pointable(pointableID).direction;
            var dotProduct = Leap.vec3.dot(direction, gesture.normal);
            
            if (dotProduct  >  0) clockwise = true;
            if (clockwise) {
                cameraController.rotateOnAxis(new THREE.Vector3(0, 0, 1), 1/2);
                console.log("Circle Gesture clockwise");
              } else {
                cameraController.rotateOnAxis(new THREE.Vector3(0, 0, -1), 1/2);
                console.log("Circle Gesture counter");
              }
              break;
          case "keyTap":
              console.log("Key Tap Gesture");
              break;
          case "screenTap":
              console.log("Screen Tap Gesture");
              break;
          case "swipe":
              var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
              if (isHorizontal) {
                  if (gesture.direction[0] > 0) { // right gesture
                      // call swipe right function, namely forward toggle
                      swipeFocusForward();
                      console.log("swipe right");
                  } else {
                      // call swipe left function, namely backward toggle
                      swipeFocusBack();
                      console.log("swipe left");
                  }
              } else {
                  if (gesture.direction[1] > 0) {
                      toggleFocusControl();
                      console.log("swipe up");
                  }
              }
              console.log("Swipe Gesture");
              break;
        }
    
    readGesture = false;
    setTimeout(function() { readGesture = true; }, 1000);
  }
});