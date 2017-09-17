function normalizeCoordPack (coordPack) {
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
    var dx = Math.abs(endPos.x - startPos.x);
    var dy = Math.abs(endPos.y - startPos.y);
    var dz = Math.abs(endPos.z - startPos.z);
    return Math.sqrt((dx*dx) + (dy*dy) + (dz*dz));
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
    displayAvatar = currentFocus.fbImage;
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
            color: 0xffff00
        });
        var textGeom = new THREE.TextGeometry( currentFocus.text, {
            font: font, 
            size: 5,
            height: 1,
            curveSegments: 4
        });
        var textGeom2 = new THREE.TextGeometry( currentFocus.fbName, {
            font: font, 
            size: 5,
            height: 1,
            curveSegments: 4
        });
        textGeom.rotateX(Math.PI/2);
        textGeom.rotateY(-Math.PI);
        textGeom.normalize();
        textGeom.scale(30, 30, 30);
        textGeom.computeBoundingBox();
        textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        textGeom2.rotateX(Math.PI/2);
        textGeom2.rotateY(-Math.PI);
        textGeom2.normalize();
        textGeom2.scale(8, 8, 8);
        textGeom2.computeBoundingBox();
        textGeom2.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        var textMesh = new THREE.Mesh( textGeom, material );
        var textMesh2 = new THREE.Mesh( textGeom2, material );
        var modifier = new THREE.BendModifier();
        var direction = new THREE.Vector3( 0, 1, 0 );
		var axis =  new THREE.Vector3( 0, 0, 1 );
		var angle = Math.PI / 3;
		var angle2 = Math.PI / 6;
        modifier.set( direction, axis, angle ).modify( textMesh.geometry );
        textMesh.position.set(currentFocus.position.x, currentFocus.position.y + 27, currentFocus.position.z - 1);
        textMesh.scale.y *= -1;
        textMesh.scale.x *= -1;
        textMesh.rotateOnAxis( new THREE.Vector3(0, 1, 0), Math.PI );
        modifier.set( direction, axis, angle2 ).modify( textMesh2.geometry );
        textMesh2.position.set(currentFocus.position.x, currentFocus.position.y + 28, currentFocus.position.z + 2);
        textMesh2.scale.y *= -1;
        textMesh2.scale.x *= -1;
        textMesh2.rotateOnAxis( new THREE.Vector3(0, 1, 0), Math.PI );
        //textMesh.rotateOnAxis( new THREE.Vector3(0, 0, 1), Math.PI );
        detailGroup.add(textMesh);
        detailGroup.add(textMesh2);
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
    drawArrows();
}


function drawArrows() {
    for (var i = arrows.children.length - 1; i >= 0; i--) {
        arrows.remove(arrows.children[i]);
    }
    for (var key1 in clusterLoop.hashTable) {
        var point1 = clusterLoop.hashTable[key1].mesh.position;;
        var point2;
        var headPoint = clusterLoop.head.network.head.mesh.position;
        var thisToHeadDist = calculateVector(headPoint, point1);
        //console.log(clusterLoop.head.network.head, clusterLoop.hashTable[key1]);
        if (clusterLoop.hashTable[key1] != clusterLoop.head.network.head) {
            for (var key2 in clusterLoop.hashTable) {
                var endPoint = clusterLoop.hashTable[key2].mesh.position;
                if (calculateVector(headPoint, endPoint) < thisToHeadDist) {
                    if (calculateVector(point1, endPoint) < thisToHeadDist) {
                        point2 = endPoint;
                    } else {
                        point2 = headPoint;
                    }
                } else {
                    point2 = headPoint;
                }
            }
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(point1, point2);
            lineGeometry.computeLineDistances();
            var lineMaterial = new THREE.LineBasicMaterial( { color: 0x00aaff } );
            var arrow = new THREE.Line( lineGeometry, lineMaterial );
            arrows.add(arrow);
        }
    }
}