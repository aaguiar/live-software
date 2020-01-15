import Object from './object';
import Building from './building';
import Color from './utils/color';
import { sortObject } from './utils/sort';

import * as THREE from 'three';
import rgbHex from 'rgb-hex';
import PackageJson from './interfaces/packageJson';
import ClassJson from './interfaces/classJson';
import Point from './utils/point';
import Size from './utils/size';

const pack = require('bin-pack');

const DISTRICT_DEFAULT_Z_SIZE: number = 0.1;

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
        maxLineOfCode: number, packageLevel: number) {
        super();
        this.packageName = packageName;
        this.id = id;
        this.hasPackages = hasPackages;
        this.packageLevel = packageLevel;
        this.ratio = (maxLevel - packageLevel) / maxLevel;

        // 1º Construct packages
        if (this.hasPackages) {
            this.constructChilds(childrenJson, maxLevel, maxLineOfCode);
        }

        // 2º Construct buildings
        this.constructBuildings(classes, maxLineOfCode);

        // 3º Construct objects view, since we calculate district size
        this.constructObject();
    }

    setDistrictPosition(x: number, y: number) {
        // set district coordinates
        this.setCoordinates(x, y);

        // set district position
        this.objectView.position.set(
            this.coordinates.x + this.size.x / 2,
            this.coordinates.y + this.size.y / 2,
            this.coordinates.z
        );

        let districtComponents: Object[] = [];
        districtComponents = districtComponents.concat(this.childrens, this.classes);

        // Sort district components by area (district and buildings)
        districtComponents.sort(sortObject);

        // Get sizes of all buildings and calculate layout
        let sizes = districtComponents.map(object => {
            return {
                width: object.size.x,
                height: object.size.y
            }
        });
        const layout = pack(sizes);

        let numStreetX = 1;
        let numStreetY = 1;
        let buildingCoordinates: Point;
        districtComponents.forEach((object: Object, i) => {
            if (i > 0) {
                if (layout.items[i].x > layout.items[i - 1].x) {
                    numStreetX++;
                }

                if (layout.items[i].y > layout.items[i - 1].y) {
                    numStreetY++;
                }
            }

            if (object instanceof Building) {
                buildingCoordinates = new Point(
                    this.coordinates.x + layout.items[i].x + 0.2 * numStreetX,
                    this.coordinates.y + layout.items[i].y + 0.2 * numStreetY,
                    this.getSizeZ()
                );

                (object as Building).setBuildingPosition(buildingCoordinates);
            } else if (object instanceof District) {
                // Set district and respective buildings
                // and childrens position
                (object as District).setDistrictPosition(
                    this.coordinates.x + layout.items[i].x + 0.2 * numStreetX,
                    this.coordinates.y + layout.items[i].y + 0.2 * numStreetY, // all districts are at the ground level (z = 0)
                )
            }
        });
    }

    setCoordinates(x: number, y: number) {
        this.coordinates = new Point(x, y, this.getSizeZ());
    }

    getSizeZ(): number {
        return this.packageLevel / 10 / 2;
    }

    /**
     * Construct visual components of district
     */
    constructObject() {
        let color: Color = this.getColor();
        this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(`#${rgbHex(color.r, color.g, color.b)}`)
        });

        this.objectView = new THREE.Mesh(this.geometry, this.material);
    }

    constructChilds(districts: PackageJson[], maxLevel: number, maxLineOfCode: number) {
        districts.forEach(district => {
            this.childrens.push(new District(
                district.package_name,
                district.id,
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

        let districtComponents: Object[] = [];
        districtComponents = districtComponents.concat(this.childrens, this.classes);

        // Sort district components by area (district and buildings)
        districtComponents.sort(sortObject);

        // Get sizes of all buildings and calculate layout
        let sizes = districtComponents.map(object => {
            return {
                width: object.size.x,
                height: object.size.y
            }
        });
        const layout = pack(sizes);

        let numStreetX = 1;
        let numStreetY = 1;
        for (let i = 0; i < districtComponents.length; i++) {
            if (i > 0) {
                if (layout.items[i].x > layout.items[i - 1].x) {
                    numStreetX++;
                }

                if (layout.items[i].y > layout.items[i - 1].y) {
                    numStreetY++;
                }
            }
        }

        this.size = new Size(
            layout.width + 0.2 * (numStreetX + 1),
            layout.height + 0.2 * (numStreetY + 1),
            DISTRICT_DEFAULT_Z_SIZE // package level represents the district size in Z axis
        );
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

        result.push(this.objectView);
        this.classes.forEach(building =>
            result.push(building.getBuildingThreeObject()));

        if (this.hasPackages) {
            this.childrens.forEach(district =>
                result = result.concat(district.getDistrictAndBuildingObjectView()));
        }

        return result;
    }

    getBuildingMaxLinesOfCode() {
        let buildingsLinesOfCode: number[] = this.classes
            .map(building => building.linesOfCode);

        return Math.max(...buildingsLinesOfCode);
    }
}

export default District;