import axios from "axios";

const instance = axios.create({
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    }
})
instance.interceptors.response.use((response) => {
    return response;
}, error => {
    if (error.response) {
        console.warn('Error status', error.response.status);
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            instance.get('http://leduyenanhquanly.xyz/api/auth/refresh', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('id_token')
                }
            }).then(r => {
                console.log(r.data);
                localStorage.setItem('id_token', r.data);
                return instance(originalRequest);
            }).catch(error => {
                console.log(error);
            });
        }
    }


});
export default instance;