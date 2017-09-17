function toggleFocus(clusterLoop) {
    if (currentFocus == clusterLoop) {
        if (clusterLoop.head.next == clusterLoop.head) {
            nodeSelected = true;
            return clusterLoop.head.network.head;
        }
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
        // cameraController.scale.x *= 0.035;
        // cameraController.scale.y *= 0.035;
        // cameraController.scale.z *= 0.035;
        cameraScaling = true;
        cameraScaleTarget = 0.035;
    } else {
        // cameraController.scale.x = 1;
        // cameraController.scale.y = 1;
        // cameraController.scale.z = 1;
        cameraScaling = true;
        cameraScaleTarget = 1;
    }
}

function transformCameraLoop() {
    if (cameraMoving) {
        if (Math.abs(cameraController.position.x - cameraControlTarget.x) < camSpeed) cameraController.position.x = currentFocus.position.x;
        if (Math.abs(cameraController.position.y - cameraControlTarget.y) < camSpeed) cameraController.position.y = currentFocus.position.y;
        if (Math.abs(cameraController.position.z - cameraControlTarget.z) < camSpeed) cameraController.position.z = currentFocus.position.z;
        
        if (!vectorsAreDifferent(cameraController.position, cameraControlTarget)) { 
            cameraMoving = false;
            if (nodeSelected) {
                document.getElementById("left").style.opacity = "0.8";
                document.getElementById("right").style.opacity = "0.8";
                document.getElementById("top").style.opacity = "0.8";
            }
        } else {
            if (cameraController.position.x > cameraControlTarget.x) cameraController.position.x -= camSpeed;
            else if (cameraController.position.x < cameraControlTarget.x) cameraController.position.x += camSpeed;
            if (cameraController.position.y > cameraControlTarget.y) cameraController.position.y -= camSpeed;
            else if (cameraController.position.y < cameraControlTarget.y) cameraController.position.y += camSpeed;
            if (cameraController.position.z > cameraControlTarget.z) cameraController.position.z -= camSpeed;
            else if (cameraController.position.z < cameraControlTarget.z) cameraController.position.z += camSpeed;
        }
    }
    if (cameraScaling) {
        if (cameraScaleTarget == 0.035) {
            if (cameraController.scale.x < cameraScaleTarget) {
                cameraController.scale.x = cameraController.scale.y = cameraController.scale.z = cameraScaleTarget;
                cameraScaling = false;
            } else {
                cameraController.scale.x *= 0.95;
                cameraController.scale.y *= 0.95;
                cameraController.scale.z *= 0.95;
            }
        } else if (cameraScaleTarget == 1) {
            if (cameraController.scale.x > cameraScaleTarget) {
                cameraController.scale.x = cameraController.scale.y = cameraController.scale.z = cameraScaleTarget;
                cameraScaling = false;
            } else {
                cameraController.scale.x *= 1.5;
                cameraController.scale.y *= 1.5;
                cameraController.scale.z *= 1.5;
            }
        }
    }
}