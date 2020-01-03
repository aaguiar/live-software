import * as THREE from 'three';

import ProjectJson from './interfaces/projectJson';
import PackageJson from './interfaces/packageJson';
import District from './district';

class City {
    id: number;
    projectName: String;
    numDistricts: number;
    districts: District[] = [];

    constructor(city: ProjectJson) {
        this.id = city.id;
        this.projectName = city.project_name;
        this.numDistricts = city.num_packages;
        console.log(city);

        this.createDistricts(city.packages);
    }

    createDistricts(districts: PackageJson[]): void {
        let maxVals = new MaxValues(0, 0);

        districts.forEach(district => {
            this.getMaxPackageLevel(district, maxVals);
        })

        districts.forEach(district => {
            this.districts.push(new District(
                district.package_name,
                district.id,
                4,
                4,
                district.i_classes,
                district.has_subpackages,
                district.packages ? district.packages : [],
                maxVals.maxTotalPackageLevel,
                maxVals.maxLinesOfCode,
                1
            )
            );
        })
    }

    getThreeObjects(): THREE.Object3D[] {
        let result: THREE.Object3D[] = [];

        this.districts.forEach(district => result = result.concat(district.getDistrictAndBuildingObjectView()));

        return result;
    }

    getMaxPackageLevel(districtJson: PackageJson, maxValues: MaxValues): void {
        if (districtJson.packages) {
            districtJson.packages.forEach(district => {
                maxValues.maxTotalPackageLevel++;
                this.getMaxPackageLevel(district, maxValues);
            })
        }

        let tmpMaxLinesOfCode: number = this.getBuildingMaxLinesOfCode(districtJson);
        maxValues.maxLinesOfCode = maxValues.maxLinesOfCode < tmpMaxLinesOfCode ? tmpMaxLinesOfCode : maxValues.maxLinesOfCode;
    }

    getBuildingMaxLinesOfCode(district: PackageJson) {
        let buildingsLinesOfCode: number[] = district.i_classes
        .map(building => building.lines_of_code);

        return Math.max(...buildingsLinesOfCode);
    }
}

class MaxValues {
    maxTotalPackageLevel: number;
    maxLinesOfCode: number;

    constructor(maxTotalPackageLevel: number, maxLinesOfCode: number) {
        this.maxTotalPackageLevel = maxTotalPackageLevel;
        this.maxLinesOfCode = maxLinesOfCode;
    }
}

export default City;