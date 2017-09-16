function toggleFocus(clusterLoop) {
    if (currentFocus == clusterLoop) {
        nodeSelected = false;
        return clusterLoop.head;
    } else if (currentFocus.parent == clusterLoop) {
        nodeSelected = true;
        return currentFocus.network.head;
    } else {
        nodeSelected = false;
        return clusterLoop;
    }
}

function updateCameraPosition() {
    // cameraController.position.x = currentFocus.position.x;
    // cameraController.position.y = currentFocus.position.y;
    // cameraController.position.z = currentFocus.position.z;
    cameraMoving = true;
    cameraControlTarget.x = currentFocus.position.x;
    cameraControlTarget.y = currentFocus.position.y;
    cameraControlTarget.z = currentFocus.position.z;
}

function zoomCamera() {
    if (nodeSelected) {
        cameraController.scale.x *= 0.035;
        cameraController.scale.y *= 0.035;
        cameraController.scale.z *= 0.035;
    } else {
        cameraController.scale.x = 1;
        cameraController.scale.y = 1;
        cameraController.scale.z = 1;
    }
}