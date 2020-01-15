import * as THREE from 'three';

import ProjectJson from './interfaces/projectJson';
import PackageJson from './interfaces/packageJson';
import District from './district';
import { sortObject } from './utils/sort';

const pack = require('bin-pack');

class City {
    /**
     * The city id.
     */
    id: number;

    /**
     * The project name.
     */
    projectName: String;

    /**
     * The number of districts in the city.
     */
    numDistricts: number;

    /**
     * The districts present in the city (first level only).
     */
    districts: District[] = [];

    /**
     * Construct of class {@link City}.
     * 
     * @param city City Json interface that contains the city configurations.
     */
    constructor(city: ProjectJson) {
        this.id = city.id;
        this.projectName = city.project_name;
        this.numDistricts = city.num_packages;

        this.createDistricts(city.packages);
    }

    /**
     * Responsible to create districts structure (layout, childrens and buildings). 1st calculates
     * the max package level (depht) and lines of codes, to calculate the ratios for the districts and buildings
     * colors. 2nd constructs the districts objects, providing their configurations. 3rd calculates the districts layouts,
     * this is needed because we can only calculate the layout with the districts sizes and the districts size are calculated
     * based on their content (children districts and buildings). 4th we set the districts with their respective and coords
     * as they also update their dependencies (children districts and buildings coordinates).
     * 
     * @param districts District Array with Json objects containing the districts configurations.
     */
    createDistricts(districts: PackageJson[]): void {
        const districtLevel: number = 1;
        let maxVals = new MaxValues(0, 0);

        // 1st Get max lines of code and max depht of packages
        districts.forEach(district => {
            this.getMaxValues(district, maxVals);
        })

        // 2nd Construct districts configurations
        districts.forEach(district => {
            this.districts.push(new District(
                district.package_name,
                district.id,
                district.i_classes,
                district.has_subpackages,
                district.packages ? district.packages : [],
                maxVals.maxTotalPackageLevel,
                maxVals.maxLinesOfCode,
                districtLevel
            )
            );
        })

        // 3rd Get districts layout
        const layout = this.constructDistrictLayout();

        // 4th Set districts (buildings and childrens) coordinates
        let numStreetX = 0;
        let numStreetY = 0;
        this.districts.forEach((district, i) => {
            if (i > 0) {
                if (layout.items[i].x > layout.items[i - 1].x) {
                    numStreetX++;
                }

                if (layout.items[i].y > layout.items[i - 1].y) {
                    numStreetY++;
                }
            }

            // Set district and respective buildings
            // and childrens position
            district.setDistrictPosition(
                layout.items[i].x + 0.2 * numStreetX,
                layout.items[i].y + 0.2 * numStreetY // all districts are at the ground level (z = 0)
            );
        });
    }

    /**
     * Constructs the districts layouts, sorting initially by their size in a descendant order
     * and then calulates the layout through {@link pack} package.
     */
    constructDistrictLayout() {
        // Sort classes by base area
        this.districts.sort(sortObject);

        // Get sizes for all districts and calculate layout
        let sizes = this.districts.map(building => {
            return {
                width: building.size.x,
                height: building.size.y
            }
        });
        return pack(sizes);
    }

    /**
     * Get the city elements (districts and buildings) objects to render on canvas.
     * 
     * @return Districts and buildings configured in the city.
     */
    getThreeObjects(): THREE.Object3D[] {
        let result: THREE.Object3D[] = [];

        this.districts.forEach(district => result = result.concat(district.getDistrictAndBuildingObjectView()));

        console.log(result);

        return result;
    }

    /**
     * Get the max values to calculate the ratios (max package level and max lines of code).
     * 
     * @param districtJson The district to calculate the max value.
     * @param maxValues Used to transport the maxes calculated for all districts.
     */
    getMaxValues(districtJson: PackageJson, maxValues: MaxValues): void {
        if (districtJson.packages) {
            districtJson.packages.forEach(district => {
                maxValues.maxTotalPackageLevel++;
                this.getMaxValues(district, maxValues);
            })
        }

        let tmpMaxLinesOfCode: number = this.getBuildingMaxLinesOfCode(districtJson);
        maxValues.maxLinesOfCode = maxValues.maxLinesOfCode < tmpMaxLinesOfCode ?
            tmpMaxLinesOfCode :
            maxValues.maxLinesOfCode;
    }

    /**
     * Get Max lines of codes in the district provided.
     * 
     * @param district The district to calculate the max value.
     */
    getBuildingMaxLinesOfCode(districtJson: PackageJson) {
        let buildingsLinesOfCode: number[] = districtJson.i_classes
            .map(building => building.lines_of_code);

        return Math.max(...buildingsLinesOfCode);
    }
}

/**
 * Class used to store the max values during the city construction process.
 */
class MaxValues {
    /**
     * Max package level.
     */
    maxTotalPackageLevel: number;

    /**
     * Max lines of code.
     */
    maxLinesOfCode: number;

    /**
     * Constructor for {@link MaxValues}.
     * 
     * @param maxTotalPackageLevel The max package level initial value.
     * @param maxLinesOfCode The max lines of code initial value.
     */
    constructor(maxTotalPackageLevel: number, maxLinesOfCode: number) {
        this.maxTotalPackageLevel = maxTotalPackageLevel;
        this.maxLinesOfCode = maxLinesOfCode;
    }
}

export default City;