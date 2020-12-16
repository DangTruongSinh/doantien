import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField } from '@material-ui/core';
import {useUserState} from "../../context/UserContext";
import OrderService from '../../api/OrderService'; 
import PopupStepperForEngineering from './PopupStepperForEngineering';
import MessageDialogComponent from '../commons/MessageDialogComponent';
//
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Loader from '../../components/loader';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white,
        },
        },
    },
}))(MenuItem);


const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TablePaginationActions(props) {
    const classes = useStyles1();
    
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
        <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
        >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
        >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
        >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});
function OrdersComponent(props) {
    const classes = useStyles2();
    let [page, setPage] = React.useState(0);
    let [rowsPerPage, setRowsPerPage] = React.useState(5);
    let [orders, setOrders] = useState([]);
    let [totalElements, settotalElements] = useState(0);
    let [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    let [openpopup, setopenpopup] = useState(false);
    let [messageResult, setmessageResult] = useState("");
    let [typeAlert, settypeAlert] = useState("");
    let [action, setAction] = useState('');
    let [serchBoCode, setSearchBoCode] = useState('');
    let [anchorEl, setAnchorEl] = React.useState(null);
    let [openRejectDialog, setOpenRejectDialog] = useState(false);
    let [idItem, setIdItem] = useState(0);
    let [messageReason, setMessageReason] = useState("");
    let [openChangeStatus, setOpenChangeStatus] =  useState(false);
    let [status, setStatus] =  useState([]);
    let [index, setIndex] =  useState(0);
    let [load, setLoad] = useState(false);
    let [statusSelect, setStatusSelect] =  useState("");

    let boCode = props.match.params.boCode;
    if(boCode == undefined){
        boCode = "";
    }
    let arr = [];
    const handleChangePage = (event, newPage) => {
        setLoad(true);
        setPage(newPage);
        getDataFromApi(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLoad(true);
        let rowPer = parseInt(event.target.value);
        setRowsPerPage(rowPer);
        setPage(0);
        getDataFromApi(0, rowPer);
    };

    useEffect(() => {
        setLoad(true);
        getDataFromApi(page, rowsPerPage, boCode);
    }, []);
    const getDataFromApi =  (page1, rowsPerPage1, fieldSearch = "") => {
        setAnchorEl(null);
        OrderService.paging(page1, rowsPerPage1, fieldSearch).then(result => {
            setOrders(result.data.content);
            settotalElements(result.data.totalElements);
            for(let i = 0; i < result.data.content.length; i++){
                arr[i] = result.data.content[i].status;
            }
            setStatus(arr);
            setLoad(false);
        }).catch(err =>{
            console.log(err);
            setLoad(false);
        });
    }
    function handleSearch(){
        setLoad(true);
        getDataFromApi(page, rowsPerPage, serchBoCode);
    }

    function handleEdit(id){
        setOpenChangeStatus(true);
    }
    const handleClick = (event, id, index, message) => {
        setAnchorEl(event.currentTarget);
        setIndex(index);
        setIdItem(id);
        setMessageReason(message);
        setStatusSelect(status[index]);
    };
    const handleCloseButtonAction = () => {
        setAnchorEl(null);
    };
    function handleViewReason(){
        setAnchorEl(null);
        setOpenRejectDialog(true);
    }
    function handleBackgroundForOrderStatus(status){
        if(status === 'Chờ thi công'){
            return "#fbff00"
        } else if(status === 'Đang thi công'){
            return "#0bcffb";
        } else if(status === 'Thi công hoàn tất'){
            return "#20d21d";
        }
    }
    function handleDownload(id, filePathDrawing){
        let index = filePathDrawing.indexOf('_') + 1;
        filePathDrawing = filePathDrawing.substring(index, filePathDrawing.length);
        let url = OrderService.urlDownloadFile;
        fetch(`${url}${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        }).then(response => {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = filePathDrawing;
                a.target="_blank";
                a.click();
            });
        }).catch(e =>{
            console.log(e);
        })
        
    }
    return (
        <>
        <div  style={{display:"flex"}}>
            <div style={{display:"flex", marginLeft: "auto"}}>
                <TextField size="small" value={serchBoCode} onChange={(e) => {setSearchBoCode(e.target.value)}} variant="outlined" style={{marginLeft: "10px"}} label="Nhập tên vật tư"/>
                <Button variant="contained" style={{backgroundColor: "#22349a", color:"white", marginLeft: "10px"}} onClick={handleSearch}>Tìm kiếm</Button>
            </div>
        </div>
        <TableContainer component={Paper} style={{marginTop:"10px"}}>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead style={{backgroundColor: "#bae3f7"}}>
                    <TableRow>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>STT</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tên vật tư</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>BBG Số</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tình trạng</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Số lượng</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Thông số kỹ thuật</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Đơn vị tính</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tải file bản vẽ</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {orders.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell component="th" scope="row" align="center"style ={{fontSize: "14px"}}>
                            {page*rowsPerPage + (index+1)}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.name != 'null' ? row.name : ""}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.boCode != 'null' ? row.boCode : ""}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            <span style={{whiteSpace:"nowrap", padding:"10px", 
                            backgroundColor: handleBackgroundForOrderStatus(status[index])}}>
                                {status[index]}</span> 
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.quantity != 'null' ? row.quantity : ""}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {row.specifications != 'null' ? row.specifications : ""}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {row.caculateUnit != 'null' ? row.caculateUnit : ""}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                        {/* { !!row.filePathDrawing && <a href={OrderService.urlDownloadFile + row.id} target="_blank" style={{marginLeft: "10px"}}>Dowload File</a>}  */}
                        { !!row.filePathDrawing  &&  <span style={{color: "blue", cursor: "pointer"}} onClick={() => handleDownload(row.id, row.filePathDrawing)}>Dowload File</span>}
                        </TableCell>

                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            <Button
                                aria-controls="customized-menu"
                                aria-haspopup="true"
                                variant="contained"
                                color="primary"
                                style={{whiteSpace:"nowrap", background: "#ffc107 linear-gradient(180deg,#ffca2c,#ffc107) repeat-x"}}
                                onClick={(e) => handleClick(e, row.id, index, row.note)}
                            >
                                hành động
                            </Button>
                            <StyledMenu
                                id="customized-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleCloseButtonAction}
                            >
                                <StyledMenuItem  onClick={() => handleEdit(row.id)}>
                                    <ListItemIcon>
                                        <EditIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Thay đổi tình trạng" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={() => {handleViewReason()}}>
                                    <ListItemIcon>
                                        <VisibilityIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Xem ghi chú" />
                                </StyledMenuItem>
                                
                            </StyledMenu>
                        </TableCell>
                    </TableRow>
                    ))}

                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={12}
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        <MessageDialogComponent open = {openRejectDialog} setOpen={setOpenRejectDialog}  messageReason={messageReason} setMessageReason={setMessageReason} type="note"/>
        <PopupStepperForEngineering open={openChangeStatus} setOpen={setOpenChangeStatus} status={status} 
                idItem = {idItem} setStatus={setStatus} setLoad={setLoad} index={index} 
                statusSelect={statusSelect} setStatusSelect={setStatusSelect}/>
        <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <Snackbar anchorOrigin={{  vertical: 'top', horizontal: 'center' }} open={openpopup} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={typeAlert}>
                    {messageResult}
                </Alert>
            </Snackbar>
            {load && <Loader/>} 
        </>
    );
    function handleClose(){
        setopenpopup(false);
    }
    
}



export default OrdersComponent;