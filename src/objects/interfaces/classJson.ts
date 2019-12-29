import AttributeJson from './attributeJson';
import MethodJson from './methodJson';

interface ClassJson {
    id: number;
    class_name: String;
    class_hash: String;
    qualified_name: String;
    lines_of_code: number;
    attribute_count: number;
    method_count: number;
    class_attributes: AttributeJson[];
    i_methods: MethodJson[];
}

export default ClassJson;