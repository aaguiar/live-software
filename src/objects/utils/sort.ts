import ClassJson from '../interfaces/classJson';

let sortBuilding = (a: ClassJson, b: ClassJson) => {
    // Use toUpperCase() to ignore character casing
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


export {
    sortBuilding
}