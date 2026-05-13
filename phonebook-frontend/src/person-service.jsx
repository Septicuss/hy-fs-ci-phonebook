import axios from "axios";

const url = '/api/persons';

const getAll = () => {
    return axios.get(url).then(response => response.data)
}

const create = (person) => {
    return axios.post(url, person).then(response => response.data);
}

const remove = (id) => {
    return axios.delete(`${url}/${id}`, {})
}

const updateNumber = (person) => {
    return axios.put(`${url}/${person.id}`, person).then(response => response.data);
}

export default {
    getAll,
    create,
    remove,
    updateNumber,
}

