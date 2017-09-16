function normalizeCoordPack(coordPackX, coordPackY, coordPackZ) {
    
    console.log(coordPackX);
    var topBound = null, bottomBound = null, rightBound = null, leftBound = null, frontBound = null, backBound = null;
    for (var i = 0; i < coordPackX.length; i++) {
        if (coordPackX[i] > leftBound || leftBound == null) leftBound = coordPackX[i];
        if (coordPackX[i] < rightBound || rightBound == null) rightBound = coordPackX[i];
        if (coordPackY[i] > frontBound || frontBound == null) frontBound = coordPackY[i];
        if (coordPackY[i] < backBound || backBound == null) backBound = coordPackY[i];
        if (coordPackZ[i] > topBound || topBound == null) topBound = coordPackZ[i];
        if (coordPackZ[i] < bottomBound || bottomBound == null) bottomBound = coordPackZ[i];
    }
    var vertLength = topBound - bottomBound;
    var horiLength = leftBound - rightBound;
    var depthLength = frontBound - backBound;
    var coordPack = [];
    for (var i = 0; i < coordPack.length; i++) {
        coordPackX[i] = (Math.abs(coordPackX[i] - rightBound) / horiLength)*sceneRadius;
        coordPackY[i] = (Math.abs(coordPackY[i] - backBound) / depthLength)*sceneRadius;
        coordPackZ[i] = (Math.abs(coordPackZ[i] - bottomBound) / vertLength)*sceneRadius;
        coordPack.push(new THREE.Vector3(coordPackX[i], coordPackY[i], coordPackZ[i]));
    }
    return {X: coordPackX, Y: coordPackY, Z: coordPackZ};
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


function displayNodeDetails() {
    
    // set profile pic
    var detailGroup = new THREE.Object3D();
    var geometry = new THREE.TorusGeometry( 24, 1, 16, 50 );
    geometry.scale(1, 1, 3);
    var material = new THREE.MeshPhongMaterial( { color: 0x00aaff, transparent: true, opacity: 0.9 } );
    var torus = new THREE.Mesh( geometry, material );
    torus.position.set(currentFocus.position.x, currentFocus.position.y, currentFocus.position.z);
    detailGroup.add( torus );
    geometry = new THREE.TorusGeometry( 24, 0.5, 8, 50 );
    material = new THREE.MeshBasicMaterial( { color: 0x0055ff } );
    torus = new THREE.Mesh( geometry, material );
    torus.position.set(currentFocus.position.x, currentFocus.position.y, currentFocus.position.z - 2);
    detailGroup.add( torus );
    torus = new THREE.Mesh( geometry, material );
    torus.position.set(currentFocus.position.x, currentFocus.position.y, currentFocus.position.z + 3);
    detailGroup.add( torus );
    var loader = new THREE.FontLoader();
    loader.load( '../public/fonts/helvetiker_regular.typeface.json', function ( font ) {
        var material = new THREE.MeshBasicMaterial({
            color: 0x0022ff
        });
        var textGeom = new THREE.TextGeometry( currentFocus.text, {
            font: font, 
            size: 5,
            height: 1,
            curveSegments: 4
        });
        textGeom.rotateX(Math.PI/2);
        textGeom.rotateY(-Math.PI);
        textGeom.normalize();
        textGeom.scale(15, 15, 15);
        textGeom.computeBoundingBox();
        textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        var textMesh = new THREE.Mesh( textGeom, material );
        var modifier = new THREE.BendModifier();
        var direction = new THREE.Vector3( 0, 1, 0 );
		var axis =  new THREE.Vector3( 0, 0, 1 );
		var angle = Math.PI / 6;
        modifier.set( direction, axis, angle ).modify( textMesh.geometry );
        textMesh.position.set(currentFocus.position.x, currentFocus.position.y + 25.5, currentFocus.position.z - 1);
        //textMesh.rotateOnAxis( new THREE.Vector3(1, 0, 0), -Math.PI/2 );
        textMesh.scale.y *= -1;
        textMesh.rotateOnAxis( new THREE.Vector3(0, 1, 0), Math.PI );
        //textMesh.rotateOnAxis( new THREE.Vector3(0, 0, 1), Math.PI );
        detailGroup.add(textMesh);
    } );

    detailGroup.position.z -= (currentFocus.mesh.geometry.parameters.radius*0.15);
    scene.add(detailGroup);
    return detailGroup;
}



function transformNodes() {
    for (var key in clusterLoop.hashTable) {
        if (clusterLoop.hashTable[key].moving) {
            var current = clusterLoop.hashTable[key];
            if (Math.abs(current.position.x - current.translateTarget.x) < camSpeed) current.position.x = current.translateTarget.x;
            if (Math.abs(current.position.y - current.translateTarget.y) < camSpeed) current.position.y = current.translateTarget.y;
            if (Math.abs(current.position.z - current.translateTarget.z) < camSpeed) current.position.z = current.translateTarget.z;
            
            if (!vectorsAreDifferent(current.position, current.translateTarget)) { 
                clusterLoop.hashTable[key].moving = false;
            } else {
                if (current == currentFocus) {
                	scene.remove(detailDisplay);
                	detailDisplay = null;
                    setTimeout(function () {
                        toggleFocusControl();
                    }, 2000);
                }
                if (current.position.x > current.translateTarget.x) current.position.x -= camSpeed;
                else if (current.position.x < current.translateTarget.x) current.position.x += camSpeed;
                if (current.position.y > current.translateTarget.y) current.position.y -= camSpeed;
                else if (current.position.y < current.translateTarget.y) current.position.y += camSpeed;
                if (current.position.z > current.translateTarget.z) current.position.z -= camSpeed;
                else if (current.position.z < current.translateTarget.z) current.position.z += camSpeed;
            }
        }
    }
}