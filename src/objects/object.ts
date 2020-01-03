import Point from './utils/point';
import THREE from 'three';

class Object {
    coordinates: Point;
    sizeX: number;
    sizeY: number;
    sizeZ: number;
    material!: THREE.MeshBasicMaterial;
    geometry!: THREE.BoxGeometry | THREE.PlaneGeometry;
    districtView!: THREE.Mesh;

    constructor(sizeX: number, sizeY: number, sizeZ: number) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;
        this.coordinates = new Point(sizeX, sizeY, sizeZ);
    }
}

export default Object;