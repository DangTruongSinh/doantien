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
import DeleteIcon from '@material-ui/icons/Delete';
import AddNewQuotationComponent from './AddNewQuotationComponent';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField } from '@material-ui/core';
import QuotationService from '../../api/QuotationService'; 
import OrderService from '../../api/OrderService';
import {useUserState} from "../../context/UserContext";
import { FormControl, InputLabel, Select } from '@material-ui/core';
import QuotationHistoriesComponent from './QuotationHistoriesComponent';
//
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import HistoryIcon from '@material-ui/icons/History';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MessageDialogComponent from '../commons/MessageDialogComponent';
import RejectedItemService from '../../api/RejectedItemService'; 
import HistoryComponent from '../commons/HistoryComponent';
import { Link } from 'react-router-dom';
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
function SuppliesComponent(props) {
    let {isAdmin, isManager } = useUserState();
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [openTimeLine, setOpenTimeLine] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openAddNew, setOpenAddNew] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [totalElements, settotalElements] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");
    const [propQuotation, setPropQuotation] = useState();
    const [action, setAction] = useState('');
    const [searchUserName, setSearchUserName] = useState('');
    const [typeFilter, setTypeFilter] = useState("UNKNOWN");
    const [histories, setHistories] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isDeleteByAdmin, setIsDeleteByAdmin] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [idItem, setIdItem] = useState(0);
    const [messageReason, setMessageReason] = useState("");
    const [indexClick, setIndexClick] =  useState(0);
    const [orderStatus, setOrderStatus] =  useState([]);
    const [typeOrderStatus, setTypeOrderStatus] =  useState("All");
    let [load, setLoad] = useState(false);

    const handleClick = (event, id, index) => {
        setAnchorEl(event.currentTarget);
        setIdItem(id);
        setIndexClick(index);
        console.log("m: "+ id);
    };

    const handleCloseButtonAction = () => {
        setAnchorEl(null);
    };

    const handleChangePage = (event, newPage) => {
        setLoad(true);
        setPage(newPage);
        getDataFromApi(newPage, rowsPerPage, searchUserName, isDeleteByAdmin, typeFilter);
    };

    const handleChangeRowsPerPage = (event) => {
        setLoad(true);
        let rowPer = parseInt(event.target.value);
        setRowsPerPage(rowPer);
        setPage(0);
        getDataFromApi(0, rowPer, searchUserName, isDeleteByAdmin, typeFilter);
    };
    function addNew(){
        setAction('add');
        setPropQuotation(null);
        setOpenAddNew(true);
    }
    useEffect(() => {
        setLoad(true);
        getDataFromApi(page, rowsPerPage);
    }, []);
    const getDataFromApi =  (page1, rowsPerPage1, fieldSearch = "", type = false, typeFilter="UNKNOWN", orderStatus="") => {
        console.log(page1, rowsPerPage1, type);
        setAnchorEl(null);
        QuotationService.getQuotations(page1, rowsPerPage1, fieldSearch, type, typeFilter, orderStatus).then(result => {
            setLoad(false);
            setQuotations(result.data.content);
            settotalElements(result.data.totalElements);
        }).catch(err =>{
            setLoad(false);
            setmessageResult("Máy chủ đang bị lỗi!");
            settypeAlert("error");
            setopenpopup(true);
            console.log(err);
        });
    }
    function onDelete (id) {
        console.log('on delete is running now: ' + id);
        setLoad(true);
        setAnchorEl(null);
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        });
        QuotationService.delete(id, isAdmin, isManager).then(result => {
            setmessageResult("Xóa thành công");
            settypeAlert("success");
            setopenpopup(true);
            console.log('Lọc theo: '+ typeFilter);
            getDataFromApi(page, rowsPerPage, searchUserName, isDeleteByAdmin, typeFilter);
        }).catch(e => {
            console.log(e);
            setLoad(false);
            setmessageResult("Máy chủ đang bị lỗi!");
            settypeAlert("error");
            setopenpopup(true);
        });
    }
    function handleSearch(){
        setLoad(true);
        getDataFromApi(page, rowsPerPage, searchUserName, isDeleteByAdmin, typeFilter);
    }
    function handleChangeTypeFilter(value){
        setLoad(true);
        setTypeFilter(value);
        getDataFromApi(page, rowsPerPage, searchUserName, isDeleteByAdmin, value );
        if(value === 'CONFIRM'){
            OrderService.getStatus().then(r => {
                setOrderStatus(r.data);
            }).catch(e => {
                console.log(e);
            })
        }
    }
    function handleChangeIsDeleteByAdmin(value){
        setLoad(true);
        setIsDeleteByAdmin(value);
        getDataFromApi(page, rowsPerPage, searchUserName, value, typeFilter );
    }
    function handleViewReason(){
        setAnchorEl(null);
        RejectedItemService.getReason(idItem).then(r => {
            console.log(r.data);
            setMessageReason(r.data);
            setOpenRejectDialog(true);
        }).catch(error => {
            console.log(error);
        })
    }
    function handleShowTimeLine(){
        setLoad(true);
        QuotationService.viewHistories(idItem).then(r => {
            console.log(r);
            if(r === undefined){
                setLoad(false);
                setmessageResult("Máy chủ đang bị lỗi!");
                settypeAlert("error");
                setopenpopup(true);
            }
            setHistories(r.data);
            setLoad(false);
            setOpenTimeLine(true);
        }).catch(err => {
            console.log(err);
            setLoad(false);
            setmessageResult("Máy chủ đang bị lỗi!");
            settypeAlert("error");
            setopenpopup(true);
        })
        
    }
    function handleGoToOrderClick(){
        props.history.push(`/app/order/${idItem}`);
    }
    function handleSetOpenEdit(){
        setAction('edit');
        setPropQuotation(quotations[indexClick]);
        setOpenAddNew(true);
    }

    function handleChangeOrderStatus(value){
        setLoad(true);
        console.log(value);
        setTypeOrderStatus(value);
        if(value === 'All') value = "";
        getDataFromApi(page, rowsPerPage, searchUserName, isDeleteByAdmin, typeFilter, value);
    }

    function covertUTCToCurrentTimezone(date1){
        console.log('date time format');
        console.log(date1);
        let moment = require('moment-timezone');
        let date = moment.utc().format(date1);
    
        let stillUtc = moment.utc(date).toDate();
        let local = moment(stillUtc).local().format('YYYY-MM-DD'); 
        console.log('after:');
        console.log(local);
        return local;
    }
    function handleColorForLate(strDateExpect, realDate){
        console.log('handle color:');
        console.log(strDateExpect);
        console.log(realDate);
        if(typeFilter !== 'CONFIRM'){
            return 'white';
        }
        let now;
        if(strDateExpect !== null){
            strDateExpect =  strDateExpect.split("/");
            let dateExpect = new Date(strDateExpect[1] + "/" + strDateExpect[0] + "/" + strDateExpect[2]);
            if(realDate === null || realDate === undefined){
                
                now = new Date();
            }
            else{
                    now = covertUTCToCurrentTimezone(realDate);
                    now = new Date(now);
            }
            if((now.getYear() === dateExpect.getYear()  && now.getMonth() > dateExpect.getMonth())
                    || now.getYear() > dateExpect.getYear() || 
                    (now.getYear() === dateExpect.getYear()  && now.getMonth() === dateExpect.getMonth() && now.getDate() > dateExpect.getDate())){
                        return "red";
                    }
        }
        
        return "white";
    }
    function handleBackgroundForOrderStatus(status){
        if(status === 'Chờ thi công'){
            return "#fbff00"
        } else if(status === 'Đang thi công'){
            return "#0bcffb";
        } else if(status === 'Thi công hoàn tất'){
            return "#20d21d";
        } else if(status === 'Giao hàng'){
            return "#c3b8b8";
        }
    }
    return (
        <>
        <div  style={{display:"flex"}}>
            <Button variant="contained" style={{backgroundColor: "#22349a", color:"white"}} onClick={addNew}>Thêm mới</Button>
            <div style={{display:"flex", marginLeft: "auto"}}>
            {
                isAdmin &&
                <FormControl variant="outlined" fullWidth={true} size="small" style={{width: "150px"}}>
                <InputLabel htmlFor="outlined-age-native-simple">Lọc Theo</InputLabel>
                <Select
                    native
                    value={isDeleteByAdmin}
                    onChange={(e) => handleChangeIsDeleteByAdmin(e.target.value)}
                    label="Type Filter">
                        <option value={false}>Chưa xóa</option>
                        <option value={true}>Xóa bởi quản lý</option>
                </Select>
            </FormControl>
            }
            
            <FormControl variant="outlined" fullWidth={true} size="small" style={{width: "150px", marginLeft: "10px"}}>
                <InputLabel htmlFor="outlined-age-native-simple">Tình trạng</InputLabel>
                <Select
                    native
                    value={typeFilter}
                    onChange={(e) => handleChangeTypeFilter(e.target.value)}
                    label="Type Item">
                        <option value="UNKNOWN">Chưa xác định</option>
                        <option value="CONFIRM">Xác nhận</option>
                        <option value="REJECT">Từ chối</option>
                </Select>
            </FormControl>
            {
                (typeFilter === 'CONFIRM') &&
                <FormControl variant="outlined" fullWidth={true} size="small" style={{width: "200px", marginLeft: "10px"}}>
                    <InputLabel htmlFor="outlined-age-native-simple">Tình trạng đơn hàng</InputLabel>
                    <Select
                        native
                        value={typeOrderStatus}
                        onChange={(e) => handleChangeOrderStatus(e.target.value)}
                        label="Type Item">
                            <option key={-1} value="All">Tất cả</option>
                            {orderStatus.map((item, key) => (
                                <option key={key} value={item.name}>{item.name}</option>
                            ) )}
                    </Select>
                </FormControl>
            }
                <TextField size="small" value={searchUserName} onChange={(e) => {setSearchUserName(e.target.value)}} variant="outlined" style={{marginLeft: "10px", width:"200px"}} label="Nhập tên khách hàng"/>
                <Button variant="contained" style={{backgroundColor: "#22349a", color:"white", marginLeft: "10px"}} onClick={handleSearch}>Tìm kiếm</Button>
            </div>
        </div>
        <TableContainer component={Paper} style={{marginTop:"10px"}}>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead style={{backgroundColor: "#bae3f7"}}>
                    <TableRow>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Id</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tên</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Mã PO</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tên khách hàng</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Số lượng</TableCell>
                        {(typeFilter === 'CONFIRM') && <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tình trạng</TableCell>}
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Giá</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Ngày giao hàng dự kiến</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {quotations.map((row, index) => (
                    <TableRow key={row.id} style={{backgroundColor: handleColorForLate(row.deliveryDate, row.realDeliveryDate)}}>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {page*rowsPerPage + (index+1)}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.name}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.boCode}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.nameOfCustomer}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.quantity}
                        </TableCell>
                        {
                            (typeFilter === 'CONFIRM') &&
                            <TableCell  align="center" style ={{fontSize: "14px"}}>
                                <span style={{padding:"10px", backgroundColor: handleBackgroundForOrderStatus(row.statusOrder)}}>{row.statusOrder}</span> 
                            </TableCell>
                        }
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {row.price}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {row.deliveryDate}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            <Button
                                aria-controls="customized-menu"
                                aria-haspopup="true"
                                variant="contained"
                                color="primary"
                                style={{background: "#ffc107 linear-gradient(180deg,#ffca2c,#ffc107) repeat-x"}}
                                onClick={(e) => handleClick(e, row.id, index)}
                            >
                                Hành động
                            </Button>
                            <StyledMenu
                                id="customized-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleCloseButtonAction}
                            >
                                <StyledMenuItem  onClick={() => handleSetOpenEdit()}>
                                    <ListItemIcon>
                                        <EditIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Chỉnh sửa" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={() => {
                                        setConfirmDialog({
                                            isOpen: true,
                                            title: 'Bạn có chắc chắn muốn xóa dữ liệu này?',
                                            subTitle: "Bạn sẽ không thể nào khôi phục lại dữ liệu này",
                                            onConfirm: () => { onDelete(row.id) }
                                        })
                                    }}>
                                <ListItemIcon>
                                    <DeleteForeverIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Xóa"/>
                                    </StyledMenuItem>
                                <StyledMenuItem onClick = {() => handleShowTimeLine()}>
                                    <ListItemIcon>
                                        <HistoryIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Lịch sử" />
                                </StyledMenuItem>
                                {
                                    (typeFilter === 'CONFIRM') && 
                                    <StyledMenuItem onClick={() => handleGoToOrderClick()}>
                                            <ListItemIcon>
                                                <ExitToAppIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Đi tới đơn hàng" />
                                    </StyledMenuItem>
                                }
                                {
                                    (typeFilter === 'REJECT') &&
                                    <StyledMenuItem onClick={() => {handleViewReason()}}>
                                        <ListItemIcon>
                                            <ExitToAppIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Lí do từ chối" />
                                    </StyledMenuItem>
                                }
                                
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
        <AddNewQuotationComponent typeFilter={typeFilter} open={openAddNew} setOpen={setOpenAddNew}  fnCallApiGetSupply = {getDataFromApi} 
            rowsPerPage = {rowsPerPage}
            propQuotation = {propQuotation} setPropQuotation={setPropQuotation} 
            action={action} idItem={idItem} orderStatus = {orderStatus} setLoad={setLoad}/>
        <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <Snackbar anchorOrigin={{  vertical: 'top', horizontal: 'center' }} open={openpopup} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={typeAlert}>
                    {messageResult}
                </Alert>
            </Snackbar>
            <MessageDialogComponent open = {openRejectDialog} setOpen={setOpenRejectDialog}  messageReason={messageReason} setMessageReason={setMessageReason} type="reason"/>
            <HistoryComponent open={openTimeLine} setOpen={setOpenTimeLine} histories = {histories} style={{width: "900px"}}/>
            {load && <Loader/>} 
        </>
    );
    function handleClose(){
        setopenpopup(false);
    }
}
export default SuppliesComponent;