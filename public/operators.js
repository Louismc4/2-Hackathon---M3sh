function normalizeCoordPack(coordPack) {
    var topBound = null, bottomBound = null, rightBound = null, leftBound = null, frontBound = null, backBound = null;
    for (var i = 0; i < coordPack.length; i++) {
        if (coordPack[i].x > leftBound || leftBound == null) leftBound = coordPack[i].x;
        if (coordPack[i].x < rightBound || rightBound == null) rightBound = coordPack[i].x;
        if (coordPack[i].y > frontBound || frontBound == null) frontBound = coordPack[i].y;
        if (coordPack[i].y < backBound || backBound == null) backBound = coordPack[i].y;
        if (coordPack[i].z > topBound || topBound == null) topBound = coordPack[i].z;
        if (coordPack[i].z < bottomBound || bottomBound == null) bottomBound = coordPack[i].z;
    }
    var vertLength = topBound - bottomBound;
    var horiLength = leftBound - rightBound;
    var depthLength = frontBound - backBound;
    for (var i = 0; i < coordPack.length; i++) {
        coordPack[i].x = (Math.abs(coordPack[i].x - rightBound) / horiLength)*sceneRadius;
        coordPack[i].y = (Math.abs(coordPack[i].y - backBound) / depthLength)*sceneRadius;
        coordPack[i].z = (Math.abs(coordPack[i].z - bottomBound) / vertLength)*sceneRadius;
    }
    return coordPack;
}

function vectorsAreDifferent(startPos, endPos) {
    if (startPos.x != endPos.x) return true;
    if (startPos.y != endPos.y) return true;
    if (startPos.z != endPos.z) return true;
    return false;
}


function calculateVector(startPos, endPos) {
    var dist = new THREE.Vector3(0, 0, 0);
    dist.x = Math.abs(endPos.x - startPos.x);
    dist.y = Math.abs(endPos.y - startPos.y);
    dist.z = Math.abs(endPos.z - startPos.z);
    return dist;
}


function getCenterPosition(target) {
    var x = 0;
    var y = 0;
    var z = 0;
    for (var key in target.hashTable) {
        if (target.hashTable.hasOwnProperty(key)) {
            x += target.hashTable[key].position.x;
            y += target.hashTable[key].position.y;
            z += target.hashTable[key].position.z;
        }
    }
    return new THREE.Vector3(x/target.nodeNum, y/target.nodeNum, z/target.nodeNum);
}