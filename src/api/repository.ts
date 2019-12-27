import sample from './sample.json';

const getStaticDataProject = () =>
    fetch('http://jsonplaceholder.typicode.com/users')
        .then(res => res.json()) // TODO: connect to repository and get data
        .catch(console.log)

export {
    getStaticDataProject,
    sample
}
