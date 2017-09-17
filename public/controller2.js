function onDocumentMouseDown(event) {
    toggleFocusControl();
}
function toggleFocusControl() {
    currentFocus = toggleFocus(clusterLoop);
    // setup node detail display
    //console.log(currentFocus.fbImage);
    displayAvatar = currentFocus.fbImage;
    
    if (nodeSelected) {
    	scene.remove(detailDisplay);
    	document.getElementById("top").src = displayAvatar;
    	detailDisplay = displayNodeDetails(currentFocus, scene);
    } else if (detailDisplay != null) {
        document.getElementById("top").style.opacity = "0";
    	scene.remove(detailDisplay);
    	detailDisplay = null;
    }
    console.log(displayAvatar);
    updateCameraPosition();
    zoomCamera();
}

function swipeFocusForward() {
    if (currentFocus.next != null) {
        document.getElementById("top").style.opacity = "0";
        currentFocus = currentFocus.next;
        updateCameraPosition();
        if (nodeSelected) {
        	scene.remove(detailDisplay);
        	detailDisplay = displayNodeDetails(currentFocus, scene);
        }
    }
}

function swipeFocusBack() {
    if (currentFocus.prev != null) {
        document.getElementById("top").style.opacity = "0";
        currentFocus = currentFocus.prev;
        updateCameraPosition();
        if (nodeSelected) {
        	scene.remove(detailDisplay);
        	detailDisplay = displayNodeDetails(currentFocus, scene);
        }
    }
}

function onGetKeyDown(event) {
    var inputKeyCode = event.keyCode;
    if (inputKeyCode == 39) {
        swipeFocusForward();
    } else if (inputKeyCode == 37) {
        swipeFocusBack();
    } else if (inputKeyCode == 76) {
        cameraController.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.1);
    } else if (inputKeyCode == 74) {
        cameraController.rotateOnAxis(new THREE.Vector3(0, 0, -1), 0.1);
    }
}