import ArgumentJson from './argumentJson';

interface MethodJson {
    id: number;
    argument_count: number;
    method_name: string;
    key: String;
    return_type: String;
    arguments: ArgumentJson[];
}

export default MethodJson;