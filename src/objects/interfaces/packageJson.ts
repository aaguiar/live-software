import ClassJson from './classJson';

interface PackageJson {
    id: number;
    package_name: String;
    class_count: number;
    has_subpackages: boolean;
    i_classes: ClassJson[];
    packages?: PackageJson[];
}

export default PackageJson;