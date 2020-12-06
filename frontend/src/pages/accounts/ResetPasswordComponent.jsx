import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {Grid, Snackbar, TextField } from '@material-ui/core';
import UserService from '../../api/UserService';
import MuiAlert from '@material-ui/lab/Alert';

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
    
    

export default function ResetPasswordComponent(props) {
    const {open, setOpen, idUser, setLoad} = props;
    const [password, setPassword] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");

    const [error, setError] = useState(false);
    return (
        <div>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Đổi Mật khẩu
                </DialogTitle>
                <DialogContent dividers >
                <Grid container>
                    <Grid item xs={12} style={{width:"500px"}}>
                        <TextField type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập mật khẩu mới" style={{margin:"10px 0px 10px 0px"}}/>
                        <TextField type="password" value={resetPassword} onChange={(e) => {setResetPassword(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập lại mật khẩu mới" style={{margin:"10px 0px 10px 0px"}} error={error} helperText={error && "Mật khẩu không khớp"}/>
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
            function handleClose() {
                setOpen(false);
            }
            function handleSubmit(){
                
                if(resetPassword !== password){
                    setError(true);
                    return;
                }
                setOpen(false);
                setLoad(true);
                const user = {
                    id: idUser,
                    password: password
                }
                UserService.changePassword(user).then(r =>{
                    console.log(r);
                    if(r === undefined){
                        setLoad(false);
                        showMessageSuccessAfterAction('Đã xảy ra lỗi trên hệ thống', 'error');
                        return;
                    }
                    showMessageSuccessAfterAction('Reset mật khẩu thành công', 'success');
                    setLoad(false);
                }).catch(e => {
                    setLoad(false);
                    console.log('error ne');
                    console.log(e);
                    showMessageSuccessAfterAction('Đã xảy ra lỗi trên hệ thống', 'error');
                })
            }
            function showMessageSuccessAfterAction(message, type){
                setOpen(false);
                setmessageResult(message);
                settypeAlert(type)
                setopenpopup(true);
            }
}


