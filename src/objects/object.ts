import Point from './utils/point';
import Size from './utils/size';
import THREE from 'three';

abstract class Object {
    coordinates: Point;
    size!: Size;
    material!: THREE.MeshBasicMaterial;
    geometry!: THREE.BoxGeometry | THREE.PlaneGeometry;
    objectView!: THREE.Mesh;

    constructor(x: number,y: number, z: number, sizeX?: number, sizeY?: number, sizeZ?: number) {
        if (sizeX && sizeY && sizeZ) {
            this.size = new Size(sizeX, sizeY, sizeZ);
        }
        this.coordinates = new Point(x, y, z);
    }
}

export default Object;