import axios from './Config';

class OrderService {
    constructor() {
        this.domain = 'http://leduyenanhquanly.xyz/orders';
        this.urlDownloadFile = `${this.domain}/downloadFile/`;
    }

    paging(page, size, boCode) {
        return axios.get(`${this.domain}?page=${page}&size=${size}&boCode=${boCode}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    getDetail(idQuotation, idOrdered, idUser) {
        console.log("domain");
        let idOrderAndUser = idOrdered + "," + idUser;
        return axios.get(`${this.domain}/${idQuotation}/${idOrderAndUser}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }

    getStatus() {
        return axios.get(`${this.domain}/status`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }

    update(body) {
        return axios({
            method: 'put',
            url: `${this.domain}`,
            data: body,
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + localStorage.getItem('id_token') }
        });
    }
    changeStatus(object) {
        return axios.put(`${this.domain}/status`, object, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
}

export default new OrderService();