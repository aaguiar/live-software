import sample from './sample1.json';

/*
 *  /projects/:id
 */
const getStaticDataProject = () =>
    fetch('http://jsonplaceholder.typicode.com/users')
        .then(res => res.json()) // TODO: connect to repository and get data
        .catch(console.log)

export {
    getStaticDataProject,
    sample
}
