import axios from './Config';

class SupplieSerice {
    constructor() {
        this.domain = 'https://leduyenanhquanly.xyz';
    }

    getSupplies(page, size, name, isDelete) {
        console.log(name);
        let address = `${this.domain}/supplies?page=${page}&size=${size}&provider=${name}&isDelete=${isDelete}`;
        let requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        };
        return fetch(address, requestOptions).then(response => response.json());
    }

    createNew(supply) {
        return axios.post(`${this.domain}/supplies`, supply, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    update(supply) {
        return axios.put(`${this.domain}/supplies`, supply, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    delete(id, isAdmin, isManager) {
        if (isAdmin) {
            return axios.delete(`${this.domain}/supplies/admin/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('id_token')
                }
            });
        } else if (isManager) {
            return axios.delete(`${this.domain}/supplies/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('id_token')
                }
            });
        }
    }
    viewHistories(idItem) {
        return axios.get(`${this.domain}/supplies/histories/${idItem}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
}

export default new SupplieSerice();