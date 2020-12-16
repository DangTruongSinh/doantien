import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


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



export default function ReasonDialogComponent(props){
    const {type, open, setOpen, messageReason, setMessageReason} = props;

    const handleClose = () => {
        setOpen(false);
    };

    function handleMessage(){
        if(messageReason === 'null')
            return '';
        return messageReason;
    }
    return(
        <>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {type === 'reason' ? 'Lí do từ chối' : 'Ghi Chú'}
                </DialogTitle>
                <DialogContent dividers >
                    <Grid container>
                        <Grid item xs={12} style={{width:"500px"}}>
                            <TextareaAutosize readOnly={true} aria-label="minimum height" rowsMin={4} value={handleMessage()} onChange={(e) => setMessageReason(e.target.value)} style={{width:"100%"}} />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}