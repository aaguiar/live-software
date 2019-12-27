import Object from './object';
import Color from './utils/color';

import * as THREE from 'three';

class Building extends Object {
    className: String;
    linesOfCode: number = 0;
    attributeCount: number = 0;
    methodCount: number = 0;
    id: String;

    constructor(className: String, id: String, sizeX: number, sizeY: number, sizeZ: number) {
        super(sizeX, sizeY, sizeZ);
        this.className = className;
        this.id = id;

        this.constructObject();
    }

    constructObject() {
        let color: Color = this.getColor(100);
        this.geometry = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color.r, color.g, color.b)
        });

        this.districtView = new THREE.Mesh(this.geometry, this.material);
    }

    /** 
     * Area is equal to no. of attributes^2 
    */
    getArea(): number {
        return this.attributeCount * this.attributeCount;
    }

    /**
     * Get {@link Building} color based on its ratio in the project
     * @param ratio Ratio of the building compared to others
     */
    getColor(ratio: number): Color {
        // rgb colors
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;

        if (ratio < 100)
            b = 51;
        else if (ratio < 150)
            b = 102;
        else if (ratio < 230)
            b = 153;
        else if (ratio < 320)
            b = 204;
        else if (ratio >= 320)
            b = 255;

        return new Color(r, g, b);
    }
}

export default Building;