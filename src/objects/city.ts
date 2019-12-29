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

        this.createDistricts(city.packages);
    }

    createDistricts(districts: PackageJson[]): void {
        
    }
}

export default City;