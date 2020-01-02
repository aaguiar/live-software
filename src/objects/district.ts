import Object from './object';
import Building from './building';
import Color from './utils/color';

import * as THREE from 'three';

class District extends Object {
    packageName: String;
    id: number;
    classCount: number = 0;
    classes: Building[];
    children: District[] = [];
    father: String = '';
    packageLevel: number = 0;
    districtView!: THREE.Mesh;

    constructor(packageName: String, id: number, sizeX: number, sizeZ: number, classes: Building[], hasPackages: boolean) {
        super(sizeX, 0, sizeZ);
        this.packageName = packageName;
        this.id = id;
        this.classes = classes;
        
        this.constructObject();
    }

    /**
     * Construct visual components of district
     */
    constructObject() {
        let color: Color = this.getColor(0.0);
        this.geometry = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color.r, color.g, color.b)
        });

        this.districtView = new THREE.Mesh(this.geometry, this.material);
    }

    /**
     * Area is the x * y
     */
    getArea(): number {
        return this.sizeX * this.sizeZ;
    }

    /**
     * Get {@link District} color based on its ratio in the project
     * @param ratio Ratio of the district compared to others
     */
    getColor(ratio: number): Color {
		// rgb colors
		let rgbAux: number = 0;
       
        if (ratio < 0.05)
            rgbAux = 255;
        else if (ratio < 0.10)
            rgbAux = 204;
        else if (ratio < 0.20)
            rgbAux = 166;
        else if (ratio < 0.30)
            rgbAux = 140;
        else if (ratio < 0.40)
            rgbAux = 128;
        else if (ratio < 0.50)
            rgbAux = 115;
        else if (ratio < 0.60)
            rgbAux = 89;
        else if (ratio < 0.70)
            rgbAux = 64;
        else if (ratio < 0.80)
            rgbAux = 38;
        else if (ratio >= 0.90)
            rgbAux = 0;

        return new Color(rgbAux, rgbAux, rgbAux);
    }

    getDistrictAndBuildingObjectView(): THREE.Mesh[] {
        let result: THREE.Mesh[] = [];

        result.push(this.districtView);
        this.classes.forEach(building => result.push(building.getBuildingThreeObject()));

        return result;
    }
}

export default District;