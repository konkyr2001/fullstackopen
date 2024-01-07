import axios from 'axios'
const url = "api/persons"

const getAll = () => {
    const request = axios.get(url);
    return request.then((response) => response.data);
}

const create = (newObject) => {
    const request = axios.post(url, newObject);
    return request.then((response) => response.data);
}

const remove = (id) => {
    const request = axios.delete(`${url}/${id}`)
    return request.then(response => response.data);
}

const update = (id, newObject) => {
    console.log("INSIDE UPDATE: ",url)
    console.log("INSIDE UPDATE: ",id)
    console.log("INSIDE UPDATE: ",newObject)
    const request = axios.put(`${url}/${id}`, newObject)
    request.then(response => console.log(response.data))

    return request.then(response => response.data)
}
export default {getAll: getAll, create: create, remove: remove, update: update}