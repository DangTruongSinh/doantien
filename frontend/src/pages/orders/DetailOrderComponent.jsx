import React, {useEffect, useState} from 'react';
import PopupStepperComponent from './PopupStepperComponent';
import HistoriesOrderComponent from './HistoriesOrderComponent';
import OrderService from '../../api/OrderService';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Loader from '../../components/loader';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function DetailOrderComponent(props) {
    const [openChangeStatus, setOpenChangeStatus] = useState(false);
    const [status, setStatus] = useState("");
    const [nameOfCustomer, setNameOfCustomer] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [boCode, setBoCode] = useState("");
    const [specifications, setSpecifications] = useState("");
    const [caculateUnit, setCaculateUnit] = useState("");
    const [quantity, setQuantity] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [price, setPrice] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [realDeliveryDate, setRealDeliveryDate] = useState("");
    const [processDate, setProcessDate] = useState("");
    const [note, setNote] = useState("");
    const [filePathDrawing, setFilePathDrawing] = useState("");
    const [histories, setHistories] = useState([]);
    const [fileTechnical, setFileTechnical] = useState(null);
    const [idItem, setIdItem] = useState(0);
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");
    const [name, setName] = useState("");
    let [load, setLoad] = useState(false);
    let idQuotation = props.match.params.idQuotation;
    let idOrder = props.match.params.idOrder;
    let idUser = props.match.params.idUser;
    if(idOrder == undefined){
        idOrder = 0;
    }
    if(idUser == undefined){
        idUser = 0;
    }
    useEffect(() => {
        setLoad(true);
        loadData();
    }, []);
    function loadData(){
        OrderService.getDetail(idQuotation, idOrder, idUser).then(r=>{
            console.log('data ne:');
            console.log(r.data);
            setName(r.data.name);
            setIdItem(r.data.id);
            setStatus(r.data.status);
            setNameOfCustomer(r.data.nameOfCustomer);
            setPhoneNumber(r.data.phoneNumber);
            setEmail(r.data.email);
            setAddress(r.data.address);
            setBoCode(r.data.boCode);
            setSpecifications(r.data.specifications);
            setCaculateUnit(r.data.caculateUnit);
            setQuantity(r.data.quantity);
            setOrderDate(r.data.orderDate);
            setPrice(r.data.price);
            setDeliveryDate(r.data.deliveryDate);
            setRealDeliveryDate(r.data.realDeliveryDate);
            setProcessDate(r.data.processDate);
            setNote(r.data.note);
            setFilePathDrawing(r.data.filePathDrawing);
            setHistories(r.data.orderedItemHistories);
            setLoad(false);
        }).catch(err=>{
            setLoad(false);
            setopenpopup(true);
            setmessageResult('Server đang bị lỗi');
            settypeAlert('error');
            console.log(err);
        })
    }
    function handleSaveChange(){
        setLoad(true);
        var bodyFormData = new FormData();
        console.log('file ne:');
        console.log(fileTechnical);
        bodyFormData.append('name', name);
        bodyFormData.append('idQuotation', idQuotation);
        bodyFormData.append('status', status);
        bodyFormData.append('nameOfCustomer', nameOfCustomer);
        bodyFormData.append('phoneNumber', phoneNumber);
        bodyFormData.append('email', email);
        bodyFormData.append('address', address);
        bodyFormData.append('boCode', boCode);
        bodyFormData.append('specifications', specifications);
        bodyFormData.append('caculateUnit', caculateUnit);
        bodyFormData.append('quantity', quantity);
        bodyFormData.append('price', price);
        bodyFormData.append('note', note);
        bodyFormData.append('deliveryDate', deliveryDate);
        if(fileTechnical != null)
            bodyFormData.append('file', fileTechnical);
        OrderService.update(bodyFormData).then(r => {
            
            loadData();
            setopenpopup(true);
            setmessageResult('Update thành công');
            settypeAlert('success');
        }).catch(err => {
            console.log(err);
            setLoad(false);
            setopenpopup(true);
            setmessageResult('Server đang bị lỗi');
            settypeAlert('error');
        })
    }
    function handleCloseNoti(){
        setopenpopup(false);
    }

    function covertUTCToCurrentTimezone(date1){
        if(date1 === null) return "";
        console.log('date time format');
        console.log(date1);
        let moment = require('moment-timezone');
        let date = moment.utc().format(date1);
    
        let stillUtc = moment.utc(date).toDate();
        let local = moment(stillUtc).local().format('YYYY-MM-DD'); 
        return local;
    }
    return (
        <div>
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">Chi tiết đơn hàng</h3>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-6 form-group">
                                        <label for="">Tên</label>
                                        <input type="text" class="form-control" value={name != 'null' ? name : ""} onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                    <div class="col-6 form-group">
                                        <label>Tình trạng đơn hàng</label>
                                        <div class="d-flex">
                                            <input type="text col-10" class="form-control" disabled value={status}/>
                                            <button class="btn btn-danger col-2 ml-2" onClick={() => setOpenChangeStatus(true)}>Thay đổi</button>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    <div class="col-6 form-group">
                                        <label for="">Tên khách hàng</label>
                                        <input type="text" class="form-control" value={nameOfCustomer != 'null' ? nameOfCustomer : ""} onChange={(e) => setNameOfCustomer(e.target.value)}/>
                                    </div>
                                    <div class="col-6">
                                        <label for="">Số điện thoại</label>
                                        <input type="text" class="form-control" value={phoneNumber != 'null' ? phoneNumber : ""} onChange={(e) => setPhoneNumber(e.target.value)}/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 form-group">
                                        <label for="">Email</label>
                                        <input type="text" class="form-control" value={email != 'null' ? email : ""} onChange = {(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div class="col-6">
                                        <label for="">Địa chỉ giao hàng</label>
                                        <input type="text" class="form-control" value={address != 'null' ? address : ""} onChange={(e) => setAddress(e.target.value)}/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <label for="">Mã bản vẽ</label>
                                        <input type="text" class="form-control" value={boCode != 'null' ? boCode : ""} onChange={(e) => setBoCode(e.target.value)}/>
                                    </div>
                                    <div class="col-6 form-group">
                                        <label for="">Thông số kỹ thuật</label>
                                        <input type="text" class="form-control" value={specifications != 'null' ? specifications : ""} onChange={(e) => setSpecifications(e.target.value)}/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <label for="">Đơn vị tính</label>
                                        <input type="text" class="form-control" value={caculateUnit != 'null' ? caculateUnit : ""} onChange={(e) => setCaculateUnit(e.target.value)}/>
                                    </div>
                                    <div class="col-6 form-group">
                                        <label for="">Số lượng</label>
                                        <input type="text" class="form-control" value={quantity != 'null' ? quantity : ""} onChange={(e) => setQuantity(e.target.value)}/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 form-group">
                                        <label for="">Ngày xác nhận</label>
                                        <input  class="form-control" value={orderDate} disabled/>
                                    </div>
                                    <div class="col-6">
                                        <label for="">Đơn giá</label>
                                        <input type="text" class="form-control" value={price != 'null'  ? price : ""} onChange={(e) => setPrice(e.target.value)}/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 form-group">
                                        <label for="">Ngày giao hàng dự kiến</label>
                                        <input type="text" class="form-control" value={deliveryDate != 'null' ? deliveryDate : ""} onChange={(e) => setDeliveryDate(e.target.value)}/>
                                    </div>
                                    <div class="col-6 form-group">
                                        <label for="">Ngày giao hàng thực tế</label>
                                        <input  class="form-control" value={covertUTCToCurrentTimezone(realDeliveryDate)} disabled/>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <label for="">Ngày thực hiện</label>
                                        <input  class="form-control" value={processDate} disabled/>
                                    </div>
                                    <div class="col-6">
                                        <label for="">Bản vẽ</label>
                                        <div style={{display: "flex"}}>
                                            <input type="file" class="form-control"  multiple onChange={e => setFileTechnical(e.target.files[0])}/>
                                                
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 form-group">
                                        Download file: { !!filePathDrawing && <a href={OrderService.urlDownloadFile + idItem} target="_blank" style={{marginLeft: "10px", color:"blue"}}>{filePathDrawing}</a>}
                                        { filePathDrawing === '' || filePathDrawing === null && <b style={{color:"red"}}>File chưa được tải lên!!!</b>}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 form-group">
                                        <label for="">Ghi chú</label>
                                        <textarea class="form-control" name="" id="" rows="5" value={note != 'null' ? note : ""} onChange={(e) => setNote(e.target.value)}></textarea>
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <button class="btn btn-primary" onClick={handleSaveChange}>Lưu thay đổi</button>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-sm-6">
                                        <h3>Lịch sử thao tác</h3>
                                    </div>
                                </div>
                                <HistoriesOrderComponent histories={histories}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <PopupStepperComponent open={openChangeStatus} setOpen={setOpenChangeStatus} status={status} setStatus={setStatus}/>
            <Snackbar anchorOrigin={{  vertical: 'top', horizontal: 'center' }} open={openpopup} autoHideDuration={2000} onClose={handleCloseNoti}>
                <Alert onClose={handleCloseNoti} severity={typeAlert}>
                    {messageResult}
                </Alert>
            </Snackbar>
            {load && <Loader/>} 
        </div>
        
    )
}
