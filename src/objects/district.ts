import Object from './object';
import Building from './building';
import Color from './utils/color';
import { sortBuilding } from './utils/sort';

import * as THREE from 'three';
import PackageJson from './interfaces/packageJson';
import ClassJson from './interfaces/classJson';
import Point from './utils/point';
import Size from './utils/size';

const pack = require('bin-pack');

class District extends Object {
    packageName: String;
    id: number;
    classCount: number = 0;
    classes: Building[] = [];
    hasPackages: boolean;
    ratio: number; objectView!: THREE.Mesh;
    childrens: District[] = [];
    father: String = '';
    packageLevel: number = 0;

    constructor(packageName: String, id: number, classes: ClassJson[],
        hasPackages: boolean, childrenJson: PackageJson[], maxLevel: number,
        maxLineOfCode: number, packageLevel: number, coordinates: Point) {
        super(coordinates.x, coordinates.y, coordinates.z);
        this.packageName = packageName;
        this.id = id;
        this.hasPackages = hasPackages;
        this.packageLevel = packageLevel;
        this.ratio = (maxLevel - packageLevel) / maxLevel;

        // 1º Construct buildings
        this.constructBuildings(classes, maxLineOfCode);

        // 2º Construct packages
        if (this.hasPackages) {
            this.constructChilds(childrenJson, maxLevel, maxLineOfCode);
        }

        // 3º Construct objects view, since we calculate district size
        // and coordinates based on its content (TODO, call method constructObject for each district and also call constructObject for each building)
        this.constructObject();
    }

    /**
     * Construct visual components of district
     */
    constructObject() {
        let color: Color = this.getColor();
        this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color.r, color.g, color.b)
        });

        this.objectView = new THREE.Mesh(this.geometry, this.material);
        this.objectView.position.set(
            this.coordinates.x + this.size.x / 2,
            this.coordinates.y + this.size.y / 2,
            0 // TODO
        );
    }

    constructBuildings(buildings: ClassJson[], maxLineOfCode: number) {
        let buildingCoordinates: Point;

        // Sort classes by base area
        buildings.sort(sortBuilding);

        // Get sizes of all buildings and calculate layout
        let sizes = buildings.map(building => {
            return {
                width: building.attribute_count,
                height: building.attribute_count
            }
        });
        const layout = pack(sizes);

        let numStreetX = 1;
        let numStreetY = 1;
        buildings.forEach((building, i) => {
            if (i > 0) {
                if (layout.items[i].x > layout.items[i - 1].x) {
                    numStreetX++;
                }

                if (layout.items[i].y > layout.items[i - 1].y) {
                    numStreetY++;
                }
            }

            buildingCoordinates = new Point(
                this.coordinates.x + layout.items[i].x + 0.2 * numStreetX,
                this.coordinates.y + layout.items[i].y + 0.2 * numStreetY,
                this.coordinates.z
            );

            this.classes.push(new Building(
                building.class_name,
                building.class_hash,
                building.id,
                building.attribute_count,
                building.method_count,
                building.lines_of_code,
                maxLineOfCode,
                buildingCoordinates
            ));
        });

        this.size = new Size(
            layout.width + 0.2 * (numStreetX + 1),
            layout.height + 0.2 * (numStreetY + 1),
            0
        );
    }

    constructChilds(districts: PackageJson[], maxLevel: number, maxLineOfCode: number) {
        let districtCoordinates = new Point(0, 0, 0);
        districts.forEach(district => {
            this.childrens.push(new District(
                district.package_name,
                district.id,
                district.i_classes,
                district.has_subpackages,
                district.packages ? district.packages : [],
                maxLevel,
                maxLineOfCode,
                this.packageLevel + 1,
                districtCoordinates
            )
            );
        })
    }
    /**
     * Area is the x * y
     */
    getArea(): number {
        return this.size.x * this.size.y;
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

        // TODO: Miss children
        result.push(this.objectView);
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