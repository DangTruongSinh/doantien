import axios from './Config';
class UserService {
    constructor() {
        this.domain = 'http://leduyenanhquanly.xyz';
    }
    checkToken() {
        return axios.get(`${this.domain}/api/auth/checkToken`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    getListAccounts(page, size, username = "") {
        return axios.get(`${this.domain}/users?page=${page}&size=${size}&username=${username}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    deleteByAdmin(id) {
        return axios.delete(`${this.domain}/users/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    getListRole() {
        return axios.get(`${this.domain}/roles`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    createNewUser(user) {
        return axios.post(`${this.domain}/users`, user, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    updateUser(user) {
        return axios.put(`${this.domain}/users`, user, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    changePassword(user) {
        return axios.put(`${this.domain}/users/password`, user, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }

    login(username, password) {
        let obj = {
            username: username,
            password: password
        }
        return axios.post(`${this.domain}/api/auth/signin`, obj);
    }
}

export default new UserService();