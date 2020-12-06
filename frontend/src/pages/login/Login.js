import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useUserDispatch, loginUser } from "../../context/UserContext";

function Copyright() {
    return ( <
        Typography variant = "body2"
        color = "textSecondary"
        align = "center" > { 'Copyright © ' } <
        Link color = "inherit"
        href = "https://material-ui.com/" >
        Your Website <
        /Link>{' '} { new Date().getFullYear() } { '.' } <
        /Typography>
    );
}
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function LoginComponent(props) {
    // global
    var userDispatch = useUserDispatch();
    var [loginValue, setLoginValue] = useState("");
    var [passwordValue, setPasswordValue] = useState("");
    var [errorEmail, setErrorEmail] = useState(false);
    var [errorPassword, setErrorPassword] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const classes = useStyles();

    return ( <
        Container component = "main"
        maxWidth = "xs" >
        <
        CssBaseline / >
        <
        div className = { classes.paper } >
        <
        Avatar className = { classes.avatar } >
        <
        LockOutlinedIcon / >
        <
        /Avatar> <
        Typography component = "h1"
        variant = "h5" >
        Sign in
        <
        /Typography> {
            isValid &&
                <
                Typography variant = "h3"
            style = {
                    { color: "red" } } >
                Tài khoản không chính xác <
                /Typography>
        }

        <
        form className = { classes.form }
        noValidate >
        <
        TextField variant = "outlined"
        margin = "normal"
        fullWidth id = "email"
        label = "Email Address"
        name = "email"
        autoComplete = "email"
        value = { loginValue }
        onChange = { e => setLoginValue(e.target.value) }
        autoFocus error = { errorEmail }
        helperText = { errorEmail ? "Email is not valid" : "" }
        /> <
        TextField variant = "outlined"
        margin = "normal"
        fullWidth name = "password"
        label = "Password"
        type = "password"
        id = "password"
        autoComplete = "current-password"
        value = { passwordValue }
        error = { errorPassword }
        helperText = { errorPassword ? "Password is required" : "" }
        onChange = { e => setPasswordValue(e.target.value) }
        /> <
        Button fullWidth variant = "contained"
        color = "primary"
        className = { classes.submit }
        onClick = {
            () => loginUser(userDispatch, loginValue, passwordValue, props.history, setErrorEmail, setErrorPassword, setIsValid) } >
        Sign In <
        /Button> <
        /form> <
        /div> <
        Box mt = { 3 } >
        <
        Copyright / >
        <
        /Box> <
        /Container>
    );
}