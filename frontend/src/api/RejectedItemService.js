import axios from './Config';

class RejectedItemService {
    constructor() {
        this.domain = 'https://leduyenanhquanly.xyz/rejectitem';
    }
    getReason(id) {
        return axios.get(`${this.domain}/reason/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    updateReason(rejectedItem) {
        return axios.put(`${this.domain}/reason`, rejectedItem, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
}

export default new RejectedItemService();