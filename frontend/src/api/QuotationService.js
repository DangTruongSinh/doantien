import axios from './Config';

class QuotationService {
    constructor() {
        this.domain = 'http://leduyenanhquanly.xyz/quotations';
    }

    getQuotations(page, size, fieldSearch, isDelete = false, quoStatus = "UNKNOWN", orderStatus = "") {
        return axios.get(`${this.domain}?page=${page}&size=${size}&name=${fieldSearch}&isDelete=${isDelete}&quoStatus=${quoStatus}&orderStatus=${orderStatus}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    viewHistories(id) {
        return axios.get(`${this.domain}/history/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    createNew(quotation) {
        return axios.post(`${this.domain}`, quotation, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    update(quotation) {
        return axios.put(`${this.domain}`, quotation, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
    delete(id, isAdmin, isManager) {
        if (isAdmin) {
            return axios.delete(`${this.domain}/admin/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('id_token')
                }
            });
        } else if (isManager) {
            return axios.delete(`${this.domain}/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('id_token')
                }
            });
        }
    }
    viewHistories(idItem) {
        return axios.get(`${this.domain}/histories/${idItem}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        });
    }
}

export default new QuotationService();