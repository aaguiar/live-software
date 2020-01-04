import Object from './object';
import Color from './utils/color';

import * as THREE from 'three';
import Point from './utils/point';

class Building extends Object {
    className: String;
    hash: String;
    linesOfCode: number;
    ratio: number;
    attributeCount: number = 0;
    methodCount: number = 0;
    id: number;

    constructor(className: String, hash: String, id: number,
        size: number, height: number, linesOfCode: number,
        maxLinesOfCode: number, coordinates: Point) {
        super(size, size, height, coordinates.x, coordinates.y, coordinates.z);
        this.className = className;
        this.hash = hash;
        this.id = id;
        this.linesOfCode = linesOfCode;
        this.ratio = (maxLinesOfCode - linesOfCode) / maxLinesOfCode;

        this.constructObject();
    }

    constructObject() {
        let color: Color = this.getColor();
        this.geometry = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color.r, color.g, color.b)
        });

        this.objectView = new THREE.Mesh(this.geometry, this.material);
        this.objectView.position.set(
            this.coordinates.x + this.sizeX / 2,
            this.coordinates.y + + this.sizeY / 2,
            this.coordinates.z + this.sizeZ / 2
        );
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
    getColor(): Color {
        // rgb colors
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;

        if (this.ratio < 0.1)
            b = 255;
        else if (this.ratio < 0.25)
            b = 204;
        else if (this.ratio < 0.5)
            b = 153;
        else if (this.ratio < 0.75)
            b = 102;
        else if (this.ratio >= 0.75)
            b = 51;

        return new Color(r, g, b);
    }

    getBuildingThreeObject(): THREE.Mesh {
        return this.objectView;
    }
}

export default Building;