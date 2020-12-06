import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import OrderService from '../../api/OrderService';
import { useUserState } from '../../context/UserContext';


import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));





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

export default function PopupStepperForEngineering(props){
    let {isEngineering} = useUserState();
    let {open, setOpen, index, status, setStatus, idItem, setLoad, statusSelect, setStatusSelect} = props;
    let [openpopup, setopenpopup] = useState(false);
    let [messageResult, setmessageResult] = useState("");
    let [typeAlert, settypeAlert] = useState("");
    let [steps, setSteps] = useState([]);
    let [arr, setArr] = useState([]);
    let [newStatus, setNewStatus] = useState("");
    let [typeAction, setTypeAction] = useState("");
    let [openConfirm, setOpenConfirm] = React.useState(false);

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };
    useEffect(() => {
      console.log('use effect of popup is run');
      OrderService.getStatus().then(r => {
        console.log('status ne:');
        console.log(r.data);
        let result = [];
        if(isEngineering){
          for(let i = 0; i < 3; i++){
            result.push(r.data[i]);
          }
        } else{
          for(let i = 0; i < r.data.length; i++){
            result.push(r.data[i]);
          }
        }
        setArr(result);
        setSteps(result);
      }).catch(err => {
        console.log(err);
      })
    }, []);
    useEffect(() => {
      console.log('index ne:::');
      console.log(statusSelect);

      if(open){
        for(let i = 0; i < arr.length; i++){
          if(arr[i].name === statusSelect){
            setActiveStep(i);
            break;
          }
        }
      }
  }, [open, statusSelect]);
    const handleClose = () => {
        setOpen(false);
    };

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    console.log('id item:', idItem);
    setOpenConfirm(true);
    setNewStatus(steps[activeStep + 1].name);
    setTypeAction('next');
  };
  function handleConfirm(){
    setLoad(true);
    setopenpopup(false);
    setOpen(false);
    if(isEngineering){
        let myStep;
        if(typeAction === 'next'){
          myStep = activeStep + 1;
        } else {
          myStep = activeStep - 1;
        }
        let obj = {
            id: idItem,
            name: steps[myStep].name
        }
        OrderService.changeStatus(obj).then(r => {
            settypeAlert('success');
            setopenpopup(true);
            setmessageResult('Thay đổi tình trạng đơn hàng thành công');
            let arr1 = [...status];
            arr1[index] = arr[myStep].name;
            console.log('status new:');
            console.log(arr1[index]);
            setStatus(arr1);
            setStatusSelect(arr1[index]);
            setLoad(false);
        }).catch(error => {
            setLoad(false);
            settypeAlert('error');
            setopenpopup(true);
            setmessageResult('Máy chủ đang bị lỗi');
        })
        
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => { 
      if(typeAction === 'next'){
        return prevActiveStep + 1;
      }
      return prevActiveStep - 1;
    });
    setSkipped(newSkipped);
    setOpenConfirm(false);
  }
  const handleBack = () => {
    setOpenConfirm(true);
    setNewStatus(steps[activeStep - 1].name);
    setTypeAction('back');
  };
  const handleReset = () => {
    setActiveStep(0);
  };

    return(
        <>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className="sinhne" >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Thay đổi tình trạng đơn hàng
                </DialogTitle>
                <DialogContent dividers  style={{width:"1000px!important"}}>
                    <Grid container>
                        <Grid item xs={12}>
                        <div className={classes.root}>
                          <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                            {steps.map((item, index) => {
                              const stepProps = {};
                              const labelProps = {};
                              return (
                                <Step key={index} {...stepProps}>
                                  <StepLabel {...labelProps}>{item.name}</StepLabel>
                                </Step>
                              );
                            })}
                          </Stepper>
                          <div>
                            {activeStep === steps.length ? (
                              <div>
                                <Typography className={classes.instructions}>
                                  Đơn hàng đã hoàn tất
                                </Typography>
                                <Button onClick={handleReset} className={classes.button}>
                                  Reset
                                </Button>
                              </div>
                            ) : (
                              <div>
    
                                <div>
                                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                    Quay lại
                                  </Button>
                                  
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                  >
                                    {activeStep === steps.length - 1 ? 'Kết thúc' : 'Tiếp theo'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Snackbar anchorOrigin={{  vertical: 'top', horizontal: 'center' }} open={openpopup} autoHideDuration={2000} onClose={handleCloseNoti}>
                <Alert onClose={handleCloseNoti} severity={typeAlert}>
                            {messageResult}
                </Alert>
            </Snackbar>
            <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <MuiDialogTitle id="alert-dialog-title">{"Xác nhận thay đổi tình trạng"}</MuiDialogTitle>
                  <MuiDialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Bạn chắc chắn chuyển tình trạng đơn hàng sang <b>{newStatus}</b>
                    </DialogContentText>
                  </MuiDialogContent>
                <DialogActions>
                  <Button onClick={handleCloseConfirm} color="primary">
                    Hủy bỏ
                  </Button>
                  <Button onClick={handleConfirm} color="primary" autoFocus>
                    Xác nhận
                  </Button>
                </DialogActions>
        </Dialog>
        </>
    );
    function handleCloseNoti(){
        setopenpopup(false);
    }
}