import axios from './Config';

class NotificationService {
    constructor() {
        this.domain = 'http://leduyenanhquanly.xyz/notifications';
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
}


export default new NotificationService();