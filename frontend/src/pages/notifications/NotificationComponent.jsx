import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NotificationService from '../../api/NotificationService';

import { FormControl, InputLabel, Select } from '@material-ui/core';
import { useUserState } from '../../context/UserContext';
import Loader from '../../components/loader';

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
function NotificationComponent(props) {
    let {isEngineering} = useUserState();
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalElements, settotalElements] = useState(0);
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");
    const [isView, setIsView] = useState(false);
    const [notification, setNotification] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    let [load, setLoad] = useState(false);

    const handleChangePage = (event, newPage) => {
        setLoad(true);
        setPage(newPage);
        getDataFromApi(newPage, rowsPerPage, isView);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowPer = parseInt(event.target.value);
        setLoad(true);
        setRowsPerPage(rowPer);
        setPage(0);
        getDataFromApi(0, rowPer, isView);
    };

    useEffect(() => {
        setLoad(true);
        getDataFromApi(page, rowsPerPage, isView);
    }, []);
    const getDataFromApi =  (page1, rowsPerPage1, isView1) => {
        NotificationService.getNotifications(page1, rowsPerPage1, isView1).then(r => {
            setNotification(r.data.content);
            settotalElements(r.data.totalElements);
            setLoad(false);
        }).catch(err => {
            console.log(err);
            setLoad(false);
            setmessageResult("Máy chủ hiện đang bị lỗi!");
            settypeAlert("error");
            setopenpopup(true);
        })
    }
    function onDelete (id) {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        });
        setLoad(true);
        NotificationService.delete(id).then(result => {
            setmessageResult("Xóa thành công");
            settypeAlert("success");
            setopenpopup(true);
            getDataFromApi(page, rowsPerPage, isView);
        }).catch(e => {
            console.log(e);
            setLoad(false);
            setmessageResult("Đã xảy ra lỗi rồi, huhu!");
            settypeAlert("error");
            setopenpopup(true);
        });
    }

    function handleChangeIsView(value){
        setLoad(true);
        setIsView(value);
        getDataFromApi(page, rowsPerPage, value);
    }
    function handleGotoOrder(idQ, idOrder, idUser, boCode){
        if(isEngineering){
            NotificationService.deleteByIdQuotation(idOrder);
            props.history.push(`/app/orders/${boCode}`);
            return;
        }
        props.history.push(`/app/order/${idQ}/${idOrder}/${idUser}`);
    }
    function covertUTCToCurrentTimezone(date1){
        let moment = require('moment-timezone');
        let date = moment.utc().format(date1);
    
        let stillUtc = moment.utc(date).toDate();
        let local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss'); 
        return local;
    }
    return (
        <>
        <div  style={{display:"flex"}}>
            <FormControl variant="outlined" fullWidth={true} size="small" style={{width: "250px"}}>
                <InputLabel htmlFor="outlined-age-native-simple">Lọc Theo</InputLabel>
                <Select
                    native
                    value={isView}
                    onChange={(e) => handleChangeIsView(e.target.value)}
                    label="Lọc Theo">
                        <option value={false}>Chưa xem</option>
                        <option value={true}>Đã xem</option>
                </Select>
            </FormControl>
        </div>
        <TableContainer component={Paper} style={{marginTop:"10px"}}>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead style={{backgroundColor: "#bae3f7"}}>
                    <TableRow>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>STT</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Mã BBG</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Nội dung thông báo</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Ngày tạo</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {notification.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {page*rowsPerPage + (index+1)}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.boCode}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.content}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {covertUTCToCurrentTimezone(row.dateCreated)}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {
                                <Button variant="contained" style={{marginRight:"10px"}} onClick={() => handleGotoOrder(row.idQuotation, row.idOrderedItem, row.idUser, row.boCode)}>
                                    Đi tới đơn hàng
                                </Button>
                            }
                            <Button variant="contained" color="secondary" style={{marginRight:"10px", background: "#dc3545 linear-gradient(180deg,#e15361,#dc3545) repeat-x"}} 
                                onClick={() => {
                                    setConfirmDialog({
                                        isOpen: true,
                                        title: 'Bạn có chắc chắn muốn xóa dữ liệu này?',
                                        subTitle: "Bạn sẽ không thể nào khôi phục lại dữ liệu này",
                                        onConfirm: () => { onDelete(row.id) }
                                    })
                            }}
                                startIcon={<DeleteIcon />}>
                                    Xóa
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}

                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value:  totalElements}]}
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
export default NotificationComponent;