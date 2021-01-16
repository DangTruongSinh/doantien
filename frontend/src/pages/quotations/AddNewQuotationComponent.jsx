import React, {  useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputLabel, Select, Grid, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import QuotationService from '../../api/QuotationService';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
    });
    function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
            </IconButton>
        ) : null}
        </MuiDialogTitle>
    );
    });

    const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    }))(MuiDialogContent);

    const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
    }))(MuiDialogActions);


function AddNewSupplieComponent(props) {
    
    const {open, setOpen, fnCallApiGetSupply, propQuotation, action, idItem, typeFilter, orderStatus, setLoad, rowsPerPage, page} = props;
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");

    const [errorBBG, setErrorBBG] = useState(false);
    const [errorCaculate, setErrorCaculate] = useState(false);
    const [errorPrice, setErrorPrice] = useState(false);
    const [oldBoCode, setOldBoCode] = useState("");
    const [price, setPrice] = useState("");
    const [boCode, setBoCode] = useState("");
    const [nameOfCustomer, setNameOfCustomer] = useState("");
    const [quantity, setQuantity] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [reason, setReason] = useState("");
    const [quotationStatus, setQuotationStatus] = useState("UNKNOWN");
    const [deliveryDate, setDeliveryDate] = useState(new Date().toLocaleDateString());

    const messageValidate = "Vui lòng điền thông tin";

    useEffect(() => {
        setErrorBBG(false);
        if(action === 'edit'){
            setName(propQuotation.name);
            setPrice(propQuotation.price);
            setBoCode(propQuotation.boCode);
            setOldBoCode(propQuotation.boCode);
            setNameOfCustomer(propQuotation.nameOfCustomer);
            setQuantity(propQuotation.quantity);
            setReason(propQuotation.reason);
            setQuotationStatus(propQuotation.quotationStatus);
            setDeliveryDate(propQuotation.deliveryDate);
            if(propQuotation != null && propQuotation.deliveryDate != null){
                let dateformat = propQuotation.deliveryDate.split("/");
                setDeliveryDate(dateformat[1] + "/" + dateformat[0] + "/" + dateformat[2]);
            }
        } else if(action === 'add'){
            setName("");
            setPrice("");
            setBoCode("");
            setNameOfCustomer("");
            setQuantity("");
            setPhoneNumber("");
            setEmail("");
            setReason("");
            setQuotationStatus("UNKNOWN");
            setDeliveryDate(new Date().toLocaleDateString());
        }
        
    }, [propQuotation])

    const handleClose = () => {
        setErrorBBG(false);
        setErrorCaculate(false);
        setErrorPrice(false);
        setOpen(false);
    };
    function showMessageSuccessAfterAction(message, type){
        setOpen(false);
        setmessageResult(message);
        settypeAlert(type)
        setopenpopup(true);
        if(type === 'success'){
            fnCallApiGetSupply(0, rowsPerPage, "", false, typeFilter);
        }
    }
    function handleSubmit(){
        
        let quotation ={
            name: name,
            boCode: boCode,
            nameOfCustomer: nameOfCustomer,
            quantity: quantity,
            quotationStatus: quotationStatus,
            price: price,
            reason: reason
        }
        if(quotationStatus === 'CONFIRM'){
            let date2 = deliveryDate;
            if(!deliveryDate.toString().includes('GMT')){
                let temp = deliveryDate.split("/");
                if(temp[1].length === 1){
                    temp[1] = "0" + temp[1];
                    date2 = temp[0] + "/" + temp[1] +  "/" + temp[2];
                }
            }
            let dateConvert = date2;
            if(!!deliveryDate && deliveryDate.toString().includes('GMT')){
                dateConvert = deliveryDate.toLocaleDateString();
                let temp = dateConvert.split("/");
                if(temp[1].length === 1){
                    temp[1] = "0" + temp[1];
                    dateConvert = temp[0] + "/" + temp[1] +  "/" + temp[2];
                }
            }
            quotation.deliveryDate = dateConvert;
        }
        
        if(action === 'add'){
            QuotationService.checkBBG(quotation.boCode).then(r => {
                if(r.data === true){
                    setErrorBBG(true);
                    return;
                }
                setOpen(false);
                setLoad(true);
                QuotationService.createNew(quotation).then(r => {
                    setLoad(false);
                    if(r === undefined){
                        showMessageSuccessAfterAction('Máy chủ hiện bị lỗi', 'error');
                        return;
                    }
                    showMessageSuccessAfterAction('Tạo đơn hàng thành công', 'success');
                }).catch(e=>{
                    console.log(e);
                    setLoad(false);
                    showMessageSuccessAfterAction('Máy chủ hiện bị lỗi', 'error');
                });
            }).catch(e => {
                console.log(e);
            })
        } else if(action === 'edit'){
            if(oldBoCode != quotation.boCode){
                QuotationService.checkBBG(quotation.boCode).then(r => {
                    console.log(r);
                    if(r.data === true){
                        setErrorBBG(true);
                        return;
                    }
                    setOpen(false);
                    setLoad(true);
                    quotation.id = idItem;
                    QuotationService.update(quotation).then(r => {
                        setLoad(false);
                        if(r === undefined){
                            showMessageSuccessAfterAction('Máy chủ hiện bị lỗi', 'error');
                            return;
                        }
                        showMessageSuccessAfterAction('Chỉnh sửa đơn hàng thành công', 'success');
                    }).catch(e => {
                        setLoad(false);
                        showMessageSuccessAfterAction('Máy chủ hiện bị lỗi', 'error');
                    })
                });
            } else {
                setOpen(false);
                setLoad(true);
                quotation.id = idItem;
                QuotationService.update(quotation).then(r => {
                    setLoad(false);
                    if(r === undefined){
                        showMessageSuccessAfterAction('Máy chủ hiện bị lỗi', 'error');
                        return;
                    }
                    showMessageSuccessAfterAction('Chỉnh sửa đơn hàng thành công', 'success');
                }).catch(e => {
                    setLoad(false);
                    showMessageSuccessAfterAction('Máy chủ hiện bị lỗi', 'error');
                })
            }
        }
        
    }
    return (
        <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {(action === 'add') ? 'Tạo mới đơn hàng' : 'Chỉnh sửa đơn hàng'}
            </DialogTitle>
            <DialogContent dividers >
            <Grid container>
                <Grid item xs={12} style={{width:"500px"}}>
                    <TextField value={name} onChange={(e) => {setName(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập tên vật tư" style={{margin:"10px 0px 10px 0px"}}/>
                    <TextField value={boCode} onChange={(e) => {setBoCode(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập số BBG" style={{margin:"10px 0px 10px 0px"}} error ={errorBBG} helperText = {errorBBG && "Mã BBG đã tồn tại"}/>
                    <TextField value={nameOfCustomer} onChange={(e) => {setNameOfCustomer(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập tên khách hàng" style={{margin:"10px 0px 10px 0px"}} error ={errorCaculate} helperText = {errorCaculate && messageValidate}/>
                    <TextField value={quantity} onChange={(e) => {setQuantity(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập số lượng" style={{margin:"10px 0px 10px 0px"}} error ={errorPrice} helperText = {errorPrice && messageValidate}/>
                    <TextField value={price} onChange={(e) => {setPrice(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập giá" style={{margin:"10px 0px 10px 0px"}} error ={errorPrice} helperText = {errorPrice && messageValidate}/>
                    { ((action === 'edit' && orderStatus !== 'CONFIRM') || action === 'add') &&
                        <FormControl variant="outlined" fullWidth={true} style={{margin:"10px 0px 10px 0px"}}>
                            <InputLabel htmlFor="outlined-age-native-simple">Chọn tình trạng</InputLabel>
                            <Select
                            native
                            value={quotationStatus}
                            onChange={(e) => setQuotationStatus(e.target.value)}
                            label="Tình trạng">
                                <option value={"UNKNOWN"}>Chưa xác định</option>
                                <option value={"CONFIRM"}>Đã xác nhận</option>
                                <option value={"REJECT"}>Từ chối</option>
                            </Select>
                        </FormControl>
                    }
                    {
                        ( quotationStatus === 'CONFIRM') &&
                        <MuiPickersUtilsProvider utils={DateFnsUtils} fullWidth={true}>
                            <KeyboardDatePicker
                                fullWidth={true}
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Ngày giao hàng dự kiến"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    }
                    {
                        (  quotationStatus === 'REJECT') &&
                        <div>
                            <h5 style ={{color:"red"}}><b>Lí do từ chối</b></h5>
                            <textarea style={{margin:"10px 0px 10px 0px", width:"100%"}} placeholder="Nhập lí do" error ={errorPrice} helperText = {errorPrice && messageValidate} aria-label="minimum height" rows={4} value={reason} onChange={(e) => setReason(e.target.value)}  />
                        </div>

                    }
                </Grid>
            </Grid>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSubmit} color="primary" variant="outlined" >
                Lưu thay đổi
            </Button>
            </DialogActions>
        </Dialog>
        <Snackbar anchorOrigin={{  vertical: 'top', horizontal: 'center' }} open={openpopup} autoHideDuration={2000} onClose={handleCloseNoti}>
            <Alert onClose={handleCloseNoti} severity={typeAlert}>
                        {messageResult}
            </Alert>
        </Snackbar>
    </div>
    );
    function handleCloseNoti(){
        setopenpopup(false);
    }
}
export default AddNewSupplieComponent;