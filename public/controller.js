function onDocumentMouseDown(event) {
    currentFocus = toggleFocus(clusterLoop);
    // setup node detail display
    updateCameraPosition();
    zoomCamera();
}

function onGetKeyDown(event) {
    var inputKeyCode = event.keyCode;
    if (inputKeyCode == 39) {
        if (currentFocus.next != null) {
            currentFocus = currentFocus.next;
            updateCameraPosition();
        }
    } else if (inputKeyCode == 37) {
        if (currentFocus.prev != null) {
            currentFocus = currentFocus.prev;
            updateCameraPosition();
        }
    }
}