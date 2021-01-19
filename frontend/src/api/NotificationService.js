import axios from './Config';

class NotificationService {
    constructor() {
        this.domain = 'https://leduyenanhquanly.xyz/notifications';
    }

    getNotifications(page, size, isView) {
        return axios.get(`${this.domain}?page=${page}&size=${size}&isView=${isView}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    deleteByIdQuotation(id) {
        return axios.delete(`${this.domain}/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }

    delete(id) {
        return axios.delete(`${this.domain}/delete/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
}


export default new NotificationService();