import * as THREE from 'three';

import ProjectJson from './interfaces/projectJson';
import PackageJson from './interfaces/packageJson';
import District from './district';
import Building from './building';

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
        let buildings: Building[] = [];
        districts.forEach(district => {
            district.i_classes.forEach(building => {
                buildings.push(new Building(
                    building.class_name,
                    building.class_hash,
                    building.id,
                    building.attribute_count,
                    building.method_count,
                    building.lines_of_code
                ));
            })

            if (district.has_subpackages) {
                console.log("Has sub-packages");
            }

            this.districts.push(new District(
                district.package_name,
                district.id,
                4,
                4,
                buildings,
                district.has_subpackages
            )
            );
        })
    }

    getThreeObjects(): THREE.Object3D[] {
        let result: THREE.Object3D[] = [];

        this.districts.forEach(district => result.concat(district.getDistrictAndBuildingObjectView()));

        return result;
    }

    render() {

    }
}

export default City;