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


export default function PopupStepperComponent(props){
    let {isEngineering} = useUserState();
    const {open, setOpen, status, setStatus} = props;
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult] = useState("");
    const [typeAlert] = useState("");
    const [steps, setSteps] = useState([]);
    const [arr, setArr] = useState([]);
    useEffect(() => {
      OrderService.getStatus().then(r => {
        let result = [];
        if(isEngineering){
          for(let i = 1; i < 4; i++){
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
      for(let i = 0; i < arr.length; i++){
        if(arr[i].name === status){
          setActiveStep(i);
          break;
        }
      }
  }, [status]);
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
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => { 
      setStatus(arr[prevActiveStep + 1].name);
      return prevActiveStep + 1;
    });
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      setStatus(arr[prevActiveStep - 1].name);
      return prevActiveStep - 1;
    });
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
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
        </>
    );
    function handleCloseNoti(){
        setopenpopup(false);
    }
}