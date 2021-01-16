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
import AddNewComponent from './AddNewAccountComponent';
import UserService from '../../api/UserService';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ResetPasswordComponent from './ResetPasswordComponent';
import { TextField } from '@material-ui/core';

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
function AccountsComponent() {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openAddNew, setOpenAddNew] = useState(false);
    const [openResetPassword, setOpenResetPassword] = useState(false);
    const [users, setusers] = useState([]);
    const [totalElements, settotalElements] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");
    const [roles, setroles] = useState([]);
    const [propUser, setPropUser] = useState();
    const [action, setAction] = useState('');
    const [idUser, setIdUser] = useState(0);
    const [searchUserName, setSearchUserName] = useState('');
    let [load, setLoad] = useState(false);
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
    function addNew(){
        setAction('add');
        setPropUser(null);
        setOpenAddNew(true);
    }
    useEffect(() => {
        setLoad(true);
        getDataFromApi(page, rowsPerPage);
        UserService.getListRole().then(r =>{
            setroles(r.data);
        }).catch(e => {
            console.log(e);
        })
    }, []);
    const getDataFromApi =  (page1, rowsPerPage1, fieldSearch = "") => {
        UserService.getListAccounts(page1, rowsPerPage1, fieldSearch).then(result => {
            setusers(result.data.content);
            settotalElements(result.data.totalElements);
            setLoad(false);
        }).catch(err =>{
            console.log(err);
            setLoad(false);
            setmessageResult("Máy chủ đang bị lỗi!");
            settypeAlert("error");
            setopenpopup(true);
        });
    }
    function onDelete (id) {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        });
        setLoad(true);
        UserService.deleteByAdmin(id).then(result => {
            if(result === undefined){
                setLoad(false);
                setmessageResult("Máy chủ đang bị lỗi!");
                settypeAlert("error");
                setopenpopup(true);
                return;
            }
            setmessageResult("Xóa thành công");
            settypeAlert("success");
            setopenpopup(true);
            getDataFromApi(page, rowsPerPage);
        }).catch(e => {
            console.log(e);
            setLoad(false);
            setmessageResult("Máy chủ đang bị lỗi!");
            settypeAlert("error");
            setopenpopup(true);
        });
    }
    function handleEdit(index){
        setAction('edit');
        setPropUser(users[index]);
        setOpenAddNew(true);
    }
    function handleSearch(){
        setLoad(true);
        getDataFromApi(page, rowsPerPage, searchUserName);
    }
    return (
        <>
        <div  style={{display:"flex"}}>
            <Button variant="contained" style={{backgroundColor: "#22349a", color:"white"}} onClick={addNew}>Thêm mới</Button>
            <div style={{display:"flex", marginLeft: "auto"}}>
                <TextField size="small" value={searchUserName} onChange={(e) => {setSearchUserName(e.target.value)}} variant="outlined" label="Nhập tài khoản để tìm kiếm"/>
                <Button variant="contained"  style={{backgroundColor: "#22349a", color:"white", marginLeft: "10px"}} onClick={handleSearch}>Tìm kiếm</Button>
            </div>
        </div>
        <TableContainer component={Paper} style={{marginTop:"10px"}}>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead style={{backgroundColor: "#bae3f7"}}>
                    <TableRow>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>STT</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tài khoản</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Quyền</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Họ và tên</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Số điện thoại</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {users.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {page*rowsPerPage + (index+1)}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.username}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.role}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.fullName}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {row.phone}
                        </TableCell>
                        <TableCell align="center" style={{whiteSpace:"nowrap"}}>
                                <Button variant="contained" onClick = {() => handleEdit(index)} style={{marginRight:"8px", background: "#ffc107 linear-gradient(180deg,#ffca2c,#ffc107) repeat-x"}}>
                                    Chỉnh sửa
                                </Button>
                                <Button variant="contained" onClick = {() => handleReset(row.id)} color="secondary" style={{marginRight:"8px", background: "#6c757d linear-gradient(180deg,#828a91,#6c757d) repeat-x"}}>
                                    Đặt lại Mật khẩu
                                </Button>
                                <Button variant="contained" color="secondary" style={{marginRight:"8px", background: "#dc3545 linear-gradient(180deg,#e15361,#dc3545) repeat-x"}} 
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
                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: totalElements }]}
                    colSpan={12}
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
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
        <AddNewComponent open={openAddNew} setOpen={setOpenAddNew} roles={roles}  fnCallApiGetUser = {getDataFromApi} propUser = {propUser} action={action} setLoad={setLoad}/>
        <ResetPasswordComponent open={openResetPassword} setOpen={setOpenResetPassword} idUser={idUser} setLoad={setLoad}/>
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
    function handleReset(id){
        setIdUser(id);
        setOpenResetPassword(true);
    }
}
export default AccountsComponent;