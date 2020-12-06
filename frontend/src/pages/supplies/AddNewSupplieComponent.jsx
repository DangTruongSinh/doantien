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
import { Grid, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import SupplieSerice from '../../api/SupplieService'; 
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
    
    const {open, setOpen, fnCallApiGetSupply, propSupply, action, setLoad} = props;
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");

    const [errorProvider, setErrorProvider] = useState(false);
    const [errorCaculate, setErrorCaculate] = useState(false);
    const [errorPrice, setErrorPrice] = useState(false);

    const [provider, setProvider] = useState("");
    const [cacualte, setCacualte] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [name, setName] = useState('');
    const messageValidate = "Vui lòng điền thông tin";

    useEffect(() => {
        if(action === 'edit'){
            setName(propSupply.name);
            setProvider(propSupply.provider);
            setCacualte(propSupply.caculateUnit);
            setPrice(propSupply.price);
            setDate(propSupply.date);
        } else if(action === 'add'){
            setName("");
            setProvider("");
            setCacualte("");
            setPrice("");
            setDate(new Date().toLocaleDateString());
        }
        
    }, [propSupply])

    const handleClose = () => {
        setErrorProvider(false);
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
            fnCallApiGetSupply(0, 5);
        }
    }
    function handleSubmit(){
        let flag = true;
        setOpen(false);
        setLoad(true);
        if(provider.trim().length === 0){
            setErrorProvider(true);
            flag =  false;
        }
        if(cacualte.trim().length === 0){
            setErrorCaculate(true);
            flag =  false;
        }
        if(price.trim().length === 0){
            setErrorPrice(true);
            flag =  false;
        }
        console.log(flag);
        if(flag){
            console.log('date ne:' + date);
            let date2 = date;
            if(!date.toString().includes('GMT')){
                let temp = date.split("/");
                if(temp[1].length === 1){
                    temp[1] = "0" + temp[1];
                    date2 = temp[0] + "/" + temp[1] +  "/" + temp[2];
                }
            }
            let dateConvert = date2;
            if(!!date && date.toString().includes('GMT')){
                dateConvert = date.toLocaleDateString();
                let temp = dateConvert.split("/");
                if(temp[1].length === 1){
                    temp[1] = "0" + temp[1];
                    dateConvert = temp[0] + "/" + temp[1] +  "/" + temp[2];
                }
            }
            let supply = {
                name: name,
                provider: provider,
                caculateUnit: cacualte,
                price: price,
                date: dateConvert,
            };
            console.log(supply);
            if(action === 'add'){
                SupplieSerice.createNew(supply).then(result => {
                    showMessageSuccessAfterAction('Tạo vật tư thành công', 'success');
            }).catch(e => {
                console.log(e);
                    showMessageSuccessAfterAction('Máy chủ đang bị lỗi rồi', 'error');
            })
            } else if(action === 'edit'){
                supply.id = props.propSupply.id;
                SupplieSerice.update(supply).then(r =>{
                    showMessageSuccessAfterAction('Chỉnh sửa vật tư thành công', 'success');
                }).catch(e =>{
                    console.log(e);
                    showMessageSuccessAfterAction('Máy chủ đang bị lỗi rồi', 'error');
            })
        }
        
        }
    }
    return (
        <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {(action === 'add') ? 'Tạo mới vật tư' : 'Chỉnh sửa vật tư'}
            </DialogTitle>
            <DialogContent dividers >
            <Grid container>
                <Grid item xs={12} style={{width:"500px"}}>
                <TextField value={name} onChange={(e) => {setName(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập tên" style={{margin:"10px 0px 10px 0px"}} error ={errorProvider} helperText = {errorProvider && messageValidate}/>
                    <TextField value={provider} onChange={(e) => {setProvider(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập tên nhà cung cấp" style={{margin:"10px 0px 10px 0px"}} error ={errorProvider} helperText = {errorProvider && messageValidate}/>
                    <TextField value={cacualte} onChange={(e) => {setCacualte(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập đơn vị tính" style={{margin:"10px 0px 10px 0px"}} error ={errorCaculate} helperText = {errorCaculate && messageValidate}/>
                    <TextField value={price} onChange={(e) => {setPrice(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập giá" style={{margin:"10px 0px 10px 0px"}} error ={errorPrice} helperText = {errorPrice && messageValidate}/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} fullWidth={true}>
                        <KeyboardDatePicker
                            fullWidth={true}
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Ngày ứng với đơn vị tính"
                            value={date}
                            onChange={(e) => setDate(e)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
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