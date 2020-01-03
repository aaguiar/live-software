import Object from './object';
import Building from './building';
import Color from './utils/color';

import * as THREE from 'three';
import PackageJson from './interfaces/packageJson';
import ClassJson from './interfaces/classJson';

class District extends Object {
    packageName: String;
    id: number;
    classCount: number = 0;
    classes: Building[] = [];
    hasPackages: boolean;
    ratio: number;
    children: District[] = [];
    father: String = '';
    packageLevel: number = 0;
    districtView!: THREE.Mesh;

    constructor(packageName: String, id: number, sizeX: number, sizeZ: number,
        classes: ClassJson[], hasPackages: boolean, childrenJson: PackageJson[],
        maxLevel: number, maxLineOfCode: number, packageLevel: number) {
        super(sizeX, 0, sizeZ);
        this.packageName = packageName;
        this.id = id;
        this.hasPackages = hasPackages;
        this.packageLevel = packageLevel;
        this.ratio =  (maxLevel - packageLevel) / maxLevel;

        this.constructBuildings(classes, maxLineOfCode);

        if (this.hasPackages) {
            this.constructChilds(childrenJson, maxLevel, maxLineOfCode);
        }
        
        this.constructObject();
    }

    /**
     * Construct visual components of district
     */
    constructObject() {
        let color: Color = this.getColor();
        this.geometry = new THREE.PlaneGeometry(this.sizeX, this.sizeY);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color.r, color.g, color.b)
        });

        this.districtView = new THREE.Mesh(this.geometry, this.material);
    }

    constructBuildings(buildings: ClassJson[], maxLineOfCode: number) {
        buildings.forEach(building => {
            this.classes.push(new Building(
                building.class_name,
                building.class_hash,
                building.id,
                building.attribute_count,
                building.method_count,
                building.lines_of_code,
                maxLineOfCode
            ));
        });
    }

    constructChilds(districts: PackageJson[], maxLevel: number, maxLineOfCode: number) {
        districts.forEach(district => {
            this.children.push(new District(
                district.package_name,
                district.id,
                4,
                4,
                district.i_classes,
                district.has_subpackages,
                district.packages ? district.packages : [],
                maxLevel,
                maxLineOfCode,
                this.packageLevel + 1
            )
            );
        })
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
    getColor(): Color {
		// rgb colors
		let rgbAux: number = 0;
       
        if (this.ratio < 0.05)
            rgbAux = 255;
        else if (this.ratio < 0.10)
            rgbAux = 204;
        else if (this.ratio < 0.20)
            rgbAux = 166;
        else if (this.ratio < 0.30)
            rgbAux = 140;
        else if (this.ratio < 0.40)
            rgbAux = 128;
        else if (this.ratio < 0.50)
            rgbAux = 115;
        else if (this.ratio < 0.60)
            rgbAux = 89;
        else if (this.ratio < 0.70)
            rgbAux = 64;
        else if (this.ratio < 0.80)
            rgbAux = 38;
        else if (this.ratio >= 0.90)
            rgbAux = 0;

        return new Color(rgbAux, rgbAux, rgbAux);
    }

    getDistrictAndBuildingObjectView(): THREE.Mesh[] {
        let result: THREE.Mesh[] = [];

        result.push(this.districtView);
        this.classes.forEach(building => result.push(building.getBuildingThreeObject()));

        return result;
    }

    getBuildingMaxLinesOfCode() {
        let buildingsLinesOfCode: number[] = this.classes
        .map(building => building.linesOfCode);

        return Math.max(...buildingsLinesOfCode);
    }
}

export default District;