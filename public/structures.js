function ClusterLoop() {
    this.head = null;
    this.hashTable = {};
    this.position = new THREE.Vector3(0, 0, 0);
}
ClusterLoop.prototype.newNode = function(streamData) {
    // take input data, find which cluster it fits in, then create the node in that cluster network
}
ClusterLoop.prototype.newCluster = function() {
    var cluster = {arrows: arrGroup, network: network, position: network.getCenter(), material: color};
    this.push(cluster);
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
    this.head;
    this.len;
}
NodeNetwork.prototype.push = function(input) {
    var head = this.head,
    current = head,
    node = {
        parentNode: null,
        child: null,
        next: null,
        prev: null,
        position: input.mesh.position,
        moving: false,
        distanceFromTarget: new THREE.Vector3(0, 0, 0),
        mesh: input.mesh,
        id: input.id,
        text: input.text
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
}
NodeNetwork.prototype.newNode = function(vectorLoc, network, text) {
    var geom = new THREE.SphereGeometry(nodePolygons, nodePolygons);
    var node = new THREE.Mesh(geom, material);
    node.scale.set(nodeScale, nodeScale, nodeScale);
    node.position.set(vectorLoc.x, vectorLoc.y, vectorLoc.z);
    scene.add(node);
    checkForClusterOverlap(vectorLoc).network.push({ mesh: node, text: text });
}
NodeNetwork.prototype.getCenter = function() {
    var x = 0;
    var y = 0;
    for (var key in this.hashTable) {
        if (this.hashTable.hasOwnProperty(key)) {
            x += this.hashTable[key].position.x;
            y += this.hashTable[key].position.y;
        }
    }
}
