import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Grid} from '@material-ui/core';

import { makeStyles, withStyles, ThemeProvider, createMuiTheme  } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Paper from '@material-ui/core/Paper';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { green, yellow, red } from '@material-ui/core/colors';

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
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));


const themeCreate = createMuiTheme({
    palette: {
        primary: green,
    },
});
const themeUpdate = createMuiTheme({
    palette: {
        primary: yellow,
    },
});
const themeDelete = createMuiTheme({
    palette: {
        primary: red,
    },
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

function SupplyHistoriesComponent(props) {
    const classes = useStyles();
    const {open, setOpen, histories} = props;
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        console.log("use effect is runnn");
        
    }, [])
    return (
        <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Lịch sử thao tác    
            </DialogTitle>
            <DialogContent dividers >
            <Grid container>
                <Grid item xs={12} style={{width:"600px"}}>
                <Timeline align="alternate">
                    {histories.map(history => (
                        <TimelineItem>
                            <TimelineOppositeContent>
                                <Typography variant="body2" color="textSecondary">
                                    {history.dateTime}
                                </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                { (history.action != null && history.action === 'CREATE') &&
                                    <ThemeProvider key={1} theme={themeCreate}>
                                        <TimelineDot color="primary">
                                            <AddCircleIcon />
                                        </TimelineDot>
                                    </ThemeProvider>
                                }
                                { (history.action != null && history.action === 'UPDATE') &&
                                    <ThemeProvider key={2} theme={themeUpdate}>
                                        <TimelineDot color="primary">
                                            <EditIcon />
                                        </TimelineDot>
                                    </ThemeProvider>
                                }
                                { (history.action != null && history.action === 'DELETE') &&
                                    <ThemeProvider key={3} theme={themeDelete}>
                                        <TimelineDot color="primary">
                                            <DeleteForeverIcon />
                                        </TimelineDot>
                                    </ThemeProvider>
                                }
                                <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography variant="h6" component="h1">
                                        <b>Username:</b> {history.nameUser}
                                    </Typography>
                                    <Typography> <b>Nội dung:</b> {history.content}</Typography>
                                </Paper>
                            </TimelineContent>
                    </TimelineItem>
                    ))}
                    
                </Timeline>
                </Grid>
            </Grid>
            </DialogContent>
        </Dialog>
    </div>
    );
    
}
export default SupplyHistoriesComponent;