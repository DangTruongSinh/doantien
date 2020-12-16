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
import { FormControl, Grid, InputLabel, Select, Snackbar, TextField } from '@material-ui/core';
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


function CustomizedDialogs(props) {
  
  const {open, setOpen, roles, fnCallApiGetUser, propUser, action, setLoad} = props;
  const [openpopup, setopenpopup] = useState(false);
  const [messageResult, setmessageResult] = useState("");
  const [typeAlert, settypeAlert] = useState("");

  const [errorUserName, seterrorUserName] = useState(false);
  const [errorPassword, seterrorPassword] = useState(false);
  const [errorFullName, seterrorFullName] = useState(false);
  const [errorPhone, seterrorPhone] = useState(false);
  const [role, setrole] = useState("Admin");
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const messageValidate = "Vui lòng điền thông tin";
  const [messageErrorUsername, setMessageErrorUsername] = useState("Username đã tồn tại");
  
  useEffect(() => {
    if(action === 'edit'){
      setname(propUser.username);
      setrole(propUser.role);
      setFullName(propUser.fullName);
      setPhone(propUser.phone);
    } else if(action === 'add'){
      setname("");
      setrole("Admin");
      setFullName("");
      setPhone("");
    }
    
}, [propUser])

  const handleClose = () => {
    seterrorUserName(false);
    seterrorPassword(false);
    seterrorFullName(false);
    seterrorPhone(false);
    setOpen(false);
  };
  function showMessageSuccessAfterAction(message, type){
    setmessageResult(message);
    settypeAlert(type)
    setopenpopup(true);
    if(type === 'success'){
      fnCallApiGetUser(0, 5);
    }
  }
  function handleSubmit(){
    setOpen(false);
    setLoad(true);
    let flag = true;
    if(name.trim().length === 0){
      seterrorUserName(true);
      setMessageErrorUsername(messageValidate);
      flag =  false;
    }
    if(password.trim().length === 0 && action ==='add'){
      seterrorPassword(true);
      flag =  false;
    }
    if(fullname.trim().length === 0){
      seterrorFullName(true);
      flag =  false;
    }
    if(phone.trim().length === 0){
      seterrorPhone(true);
      flag =  false;
    }
    if(flag){
      let account = {
        username: name,
        password: password,
        fullName: fullname,
        phone: phone,
        role: role
      };
      if(action === 'add'){
        UserService.createNewUser(account).then(result => {
          setLoad(false);
          if(!!result.data){
            showMessageSuccessAfterAction('Tạo tài khoản thành công', 'success');
          } else {
            seterrorUserName(true);
          }
        }).catch(e => {
          setLoad(false);
          console.log(e);
          showMessageSuccessAfterAction('Máy chủ đang bị lỗi rồi', 'error');
        })
      } else if(action === 'edit'){
        account.id = props.propUser.id;
        UserService.updateUser(account).then(r =>{
          setLoad(false);
          showMessageSuccessAfterAction('Chỉnh sửa tài khoản thành công', 'success');
        }).catch(e =>{
          setLoad(false);
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
            {(action === 'add') ? 'Tạo mới tài khoản' : 'Chỉnh sửa tài khoản'}
        </DialogTitle>
        <DialogContent dividers >
          <Grid container>
            <Grid item xs={12} style={{width:"500px"}}>
              <TextField value={name} onChange={(e) => {setname(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập tài khoản" style={{margin:"10px 0px 10px 0px"}} error ={errorUserName} helperText = {errorUserName && messageErrorUsername}/>
              {
                (action === 'add') && <TextField value={password} onChange={(e) => {setPassword(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập mật khẩu" style={{margin:"10px 0px 10px 0px"}} type="password" error ={errorPassword} helperText = {errorPassword && messageValidate}/>
              }
              <TextField value={fullname} onChange={(e) => {setFullName(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập họ và tên" style={{margin:"10px 0px 10px 0px"}} error ={errorFullName} helperText = {errorFullName && messageValidate}/>
              <TextField value={phone} onChange={(e) => {setPhone(e.target.value)}} variant="outlined" fullWidth={true} label="Nhập số điện thoại" style={{margin:"10px 0px 10px 0px"}} error ={errorPhone} helperText = {errorPhone && messageValidate}/>
              <FormControl variant="outlined" fullWidth={true}>
                <InputLabel htmlFor="outlined-age-native-simple">Quyền</InputLabel>
                <Select
                  native
                  value={role}
                  onChange={(e) => setrole(e.target.value)}
                  label="Role"
                  
                >
                  {
                    roles.map((item, index) => (<option key={index} value={item.name}>{item.name}</option>))
                  }
                  
                </Select>
            </FormControl>
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
export default CustomizedDialogs;