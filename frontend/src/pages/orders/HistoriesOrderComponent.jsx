import React from 'react';
import { makeStyles, ThemeProvider, createMuiTheme  } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { green, yellow, red } from '@material-ui/core/colors';
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
export default function HistoriesOrderComponent(props) {
    const classes = useStyles();
    const {histories} = props;
    function covertUTCToCurrentTimezone(date1){
        console.log('date time format');
        console.log(date1);
        let moment = require('moment-timezone');
        let date = moment.utc().format(date1);
    
        let stillUtc = moment.utc(date).toDate();
        let local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss'); 
        return local;
    }
    return (
        <Timeline align="alternate">
        {histories.map(history => (
            <TimelineItem>
                <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                    {
                        covertUTCToCurrentTimezone(history.dateTime)
                    }
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
                            <b>Tài khoản:</b> {history.nameUser}
                        </Typography>
                        <Typography> <b>Nội dung:</b> {history.content}</Typography>
                    </Paper>
                </TimelineContent>
        </TimelineItem>
        ))}
        
    </Timeline>
    );
    }
