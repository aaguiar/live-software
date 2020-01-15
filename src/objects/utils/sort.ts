import ClassJson from '../interfaces/classJson';
import Object from '../object';

let sortBuilding = (a: ClassJson, b: ClassJson) => {
    const bandA = a.attribute_count * a.attribute_count;
    const bandB = b.attribute_count * b.attribute_count;

    let c = 0;
    if (bandA < bandB) {
        c = 1;
    } else if (bandA > bandB) {
        c = -1;
    }
    return c;
}

let sortObject = (a: Object, b: Object) => {
    const distA = a.size.x * a.size.y;
    const distB = b.size.x * b.size.y;

    let c = 0;
    if (distA < distB) {
        c = 1;
    } else if (distA > distB) {
        c = -1;
    }
    return c;
}


export {
    sortBuilding,
    sortObject
}
