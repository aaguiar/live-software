import PackageJson from './packageJson';

interface ProjectJson {
    id: number;
    num_packages: number;
    project_name: String;
    packages: PackageJson[];
}

export default ProjectJson;