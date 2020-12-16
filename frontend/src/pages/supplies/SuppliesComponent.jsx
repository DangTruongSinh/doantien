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
import AddNewSupplieComponent from './AddNewSupplieComponent';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { TextField } from '@material-ui/core';
import SupplieSerice from '../../api/SupplieService'; 
import {useUserState} from "../../context/UserContext";
import { FormControl, InputLabel, Select } from '@material-ui/core';
import HistoryComponent from '../commons/HistoryComponent';
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
function SuppliesComponent() {
    let {isAdmin, isManager } = useUserState();
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [openTimeLine, setOpenTimeLine] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openAddNew, setOpenAddNew] = useState(false);
    const [supplies, setSupplies] = useState([]);
    const [totalElements, settotalElements] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [openpopup, setopenpopup] = useState(false);
    const [messageResult, setmessageResult] = useState("");
    const [typeAlert, settypeAlert] = useState("");
    const [propSupply, setPropSupply] = useState();
    const [action, setAction] = useState('');
    const [searchUserName, setSearchUserName] = useState('');
    const [typeFilter, setTypeFilter] = useState(false);
    const [histories, setHistories] = useState([]);
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
        setPropSupply(null);
        setOpenAddNew(true);
    }
    useEffect(() => {
        setLoad(true);
        getDataFromApi(page, rowsPerPage);
    }, []);
    const getDataFromApi =  (page1, rowsPerPage1, fieldSearch = "", type=false) => {
        SupplieSerice.getSupplies(page1, rowsPerPage1, fieldSearch, type).then(result => {
            setLoad(false);
            setSupplies(result.data.content);
            settotalElements(result.data.totalElements);
        }).catch(err =>{
            console.log(err);
            setLoad(false);
            setmessageResult("Đã xảy ra lỗi rồi, huhu!");
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
        SupplieSerice.delete(id, isAdmin, isManager).then(result => {
            setmessageResult("Xóa thành công");
            settypeAlert("success");
            setopenpopup(true);
            getDataFromApi(page, rowsPerPage);
        }).catch(e => {
            console.log(e);
            setmessageResult("Đã xảy ra lỗi rồi, huhu!");
            settypeAlert("error");
            setopenpopup(true);
        });
        getDataFromApi(page, rowsPerPage);
    }
    function handleEdit(index){
        setAction('edit');
        setPropSupply(supplies[index]);
        setOpenAddNew(true);
    }
    function handleSearch(){
        setLoad(true);
        getDataFromApi(page, rowsPerPage, searchUserName, typeFilter);
    }
    function handleChangeTypeFilter(value){
        setLoad(true);
        setTypeFilter(value);
        getDataFromApi(page, rowsPerPage, searchUserName, value);
    }
    function handleShowTimeLine(id){
        SupplieSerice.viewHistories(id).then(r => {
            console.log(r);
            setHistories(r.data);
            setOpenTimeLine(true);
        }).catch(err => {
            console.log(err);
        })
        
    }
    return (
        <>
        <div  style={{display:"flex"}}>
            <Button variant="contained" style={{backgroundColor: "#22349a", color:"white"}} onClick={addNew}>Thêm mới</Button>
            <div style={{display:"flex", marginLeft: "auto"}}>
            {
                isAdmin &&
                <FormControl variant="outlined" fullWidth={true} size="small" style={{width: "250px"}}>
                <InputLabel htmlFor="outlined-age-native-simple">Lọc theo</InputLabel>
                <Select
                    native
                    value={typeFilter}
                    onChange={(e) => handleChangeTypeFilter(e.target.value)}
                    label="Type Filter">
                        <option value={false}>Chưa xóa</option>
                        <option value={true}>Xóa bởi quản lý</option>
                </Select>
            </FormControl>
            }
            
                <TextField size="small" value={searchUserName} onChange={(e) => {setSearchUserName(e.target.value)}} variant="outlined" style={{marginLeft: "10px"}} label="Nhập tên nhà cung cấp"/>
                <Button variant="contained" style={{backgroundColor: "#22349a", color:"white", marginLeft: "10px"}} onClick={handleSearch}>Tìm kiếm</Button>
            </div>
        </div>
        <TableContainer component={Paper} style={{marginTop:"10px"}}>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead style={{backgroundColor: "#bae3f7"}}>
                    <TableRow>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>STT</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Tên vật tư</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Nhà cung cấp</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Đơn vị tính</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Giá</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Ngày ứng với đơn vị tính</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold", fontSize: "16px"}}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {supplies.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {page*rowsPerPage + (index+1)}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.name}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" style ={{fontSize: "14px"}}>
                            {row.provider}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.caculateUnit}
                        </TableCell>
                        <TableCell  align="center" style ={{fontSize: "14px"}}>
                            {row.price}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px"}}>
                            {formatDate(row.date)}
                        </TableCell>
                        <TableCell align="center" style ={{fontSize: "14px", whiteSpace:"nowrap"}}>
                            <Button variant="contained" onClick = {() => handleEdit(index)} style={{marginRight:"10px", background: "#ffc107 linear-gradient(180deg,#ffca2c,#ffc107) repeat-x"}}>
                                Chỉnh sửa
                            </Button>
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
                            <Button variant="contained" onClick = {() => handleShowTimeLine(row.id)} style={{marginRight:"10px", background: "linear-gradient(rgb(130, 138, 145), rgb(108, 117, 125)) repeat-x rgb(108, 117, 125)"}}>
                                Lịch sử
                            </Button>
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
        <AddNewSupplieComponent open={openAddNew} setOpen={setOpenAddNew}  fnCallApiGetSupply = {getDataFromApi} propSupply = {propSupply} setpropSupply={setPropSupply} action={action} setLoad={setLoad}/>
        <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <Snackbar anchorOrigin={{  vertical: 'top', horizontal: 'center' }} open={openpopup} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={typeAlert}>
                    {messageResult}
                </Alert>
            </Snackbar>
            <HistoryComponent open={openTimeLine} setOpen={setOpenTimeLine} histories = {histories} setLoad={setLoad}/>
            {load && <Loader/>} 
        </>
        
    );
    function handleClose(){
        setopenpopup(false);
    }
    function formatDate(date){
        let arr = date.split('/');
        return arr[1] + "/" + arr[0] + "/" + arr[2];
    }
}
export default SuppliesComponent;