function onDocumentMouseDown(event) {
    toggleFocusControl();
}
function toggleFocusControl() {
    currentFocus = toggleFocus(clusterLoop);
    // setup node detail display
    if (nodeSelected) {
    	detailDisplay = displayNodeDetails(currentFocus, scene);
    } else if (detailDisplay != null) {
    	scene.remove(detailDisplay);
    	detailDisplay = null;
    }
    
    updateCameraPosition();
    zoomCamera();
}

function swipeFocusForward() {
    if (currentFocus.next != null) {
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