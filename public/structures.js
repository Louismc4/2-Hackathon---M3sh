function ClusterLoop() {
    this.head = null;
    this.hashTable = {};
    this.position = new THREE.Vector3(0, 0, 0);
    this.nodeNum = 0;
}

ClusterLoop.prototype.validateCenter = function() {
    this.position = getCenterPosition(this);
}

ClusterLoop.prototype.newNode = function(streamData, index) {
    var vectorLoc = normalizeCoordPack(streamData.vectors)[index];
    //var vectorLoc = new THREE.Vector3(temp.X[index], temp.Y[index], temp.Z[index]);
    var cluster;
    console.log("Created new node");
    if (!this.head) {
        cluster = this.newCluster(new THREE.Object3D(), new NodeNetwork(), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    } else {
        cluster = this.checkForClusterLink(vectorLoc);
    }
    cluster.network.newNode(vectorLoc, cluster, streamData, index, this);
    // cluster.recalculateArrows(); TODO once we get node connections
}
ClusterLoop.prototype.checkForClusterLink = function(streamData) {
    // check node connections when we get real connection data
    // -- head cluster return
    return this.head;
}
ClusterLoop.prototype.newCluster = function(arrGroup, network, color) {
    var cluster = {arrows: arrGroup, network: network, position: network.getCenter(), material: color};
    this.push(cluster);
    return cluster;
}
ClusterLoop.prototype.push = function(cluster) {
    var current = this.head,
    cluster = {
        parent: this,
        next: null,
        prev: null,
        arrows: cluster.arrows,
        network: cluster.network,
        position: cluster.position,
        material: cluster.material
    }
    if(!this.head) { // if there are no clusters yet then loop it up
        cluster.next = cluster;
        cluster.prev = cluster;
        this.head = cluster;
    } else { // push it to the end of the circle
        while (current.next != this.head)
            current = current.next;
        cluster.next = this.head;
        cluster.prev = current;
        this.head.prev = cluster;
        current.next = cluster;
    }
}


function NodeNetwork() {
    this.hashTable = {};
    this.head = null;
    this.nodeNum = 0;
}
NodeNetwork.prototype.push = function(input, clusterLoop) {
    var head = this.head,
    current = head,
    node = {
        parentNode: null,
        child: null,
        next: null,
        prev: null,
        position: input.mesh.position,
        moving: false,
        translateTarget: new THREE.Vector3(0, 0, 0),
        mesh: input.mesh,
        id: input.id,
        text: input.text,
        fbName: input.name,
        fbImage: input.image,
        status: input['status']
    }
    
    if(!head) { // no nodes so init the primary node as head
        node.next = node;
        node.prev = node;
        this.head = node;
    } else {
        while (current.next != head) {
            current = current.next;
        }
        node.next = head;
        node.prev = current;
        head.prev = node;
        current.next = node;
    }
    this.hashTable[node.id] = node;
    clusterLoop.hashTable[node.id] = node;
    this.nodeNum += 1;
    clusterLoop.nodeNum += 1;
}
NodeNetwork.prototype.newNode = function(vectorLoc, cluster, streamData, index, clusterLoop) {
    var text = streamData.statuses[index];
    var id = streamData['ids'][index];
    var geom = new THREE.SphereGeometry(nodePolygons, nodePolygons, nodePolygons);
    var node = new THREE.Mesh(geom, cluster.material);
    //var node = new THREE.Mesh(geom);
    node.scale.set(nodeScale, nodeScale, nodeScale);
    node.position.set(vectorLoc.x, vectorLoc.y, vectorLoc.z);
    var fbName = streamData.fbData[index].name;
    var fbImage = streamData.fbData[index].image;
    var fbStatus = streamData.fbData[index]['status'];
    if (fbStatus != "Safe") node.material = new THREE.MeshBasicMaterial({color: 0xff0000});
    scene.add(node);
    cluster.network.push({ mesh: node, text: text, id: id, name: fbName, image: fbImage, status: fbStatus }, clusterLoop);
}
NodeNetwork.prototype.getCenter = function() {
    var x = 0;
    var y = 0;
    var z = 0;
    for (var key in this.hashTable) {
        if (this.hashTable.hasOwnProperty(key)) {
            x += this.hashTable[key].position.x;
            y += this.hashTable[key].position.y;
            z += this.hashTable[key].position.z;
        }
    }
    return new THREE.Vector3(x/this.len, y/this.len, z/this.len);
}
NodeNetwork.prototype.deleteNode = function(node) {
    var current = this.head,
        prev;
    // delete head case
    this.hashTable[node.id] = null;
    clusterLoop.hashTable[node.id] = null;
    scene.remove(node);
    if (current == node) {
        this.head = this.head.next;
        this.head.prev = current.prev;
        this.head.prev.next = this.head;
        this.head.next.prev = this.head;
        
        if (this.head.next.mesh.position == this.head.mesh.position) this.head = null; // only one node, get rid of the cluster and done
        return this; // we are done
    }
    
    while (current.next.mesh.position != this.head.mesh.position) {
        if (current.mesh.position == node.mesh.position) {
            prev.next = current.next;
            current.next.prev = prev;
            return this; // we are done
        }
        prev = current;
        current = current.next;
    }
    console.log("Failed");
    return this;
}
