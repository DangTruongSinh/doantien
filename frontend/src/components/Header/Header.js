import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import {useUserState} from "../../context/UserContext";
// styles
import useStyles from "./styles";

// components
import { Badge, Typography } from "../Wrappers/Wrappers";
import Notification from "../Notification/Notification";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserDispatch, signOut } from "../../context/UserContext";
import NotificationService from '../../api/NotificationService';

import ResetPasswordComponent from '../../pages/accounts/ResetPasswordComponent';


export default function Header(props) {
  var classes = useStyles();
  const [openResetPassword, setOpenResetPassword] = useState(false);

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();
  const [noti, setNoti] = useState([]);
  const [size, setSize] = useState(0);

  // local
  var [notificationsMenu, setNotificationsMenu] = useState(null);
  var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
  var arrPre = [];
  let {isAdmin, isManager, isEngineering } = useUserState();

  useEffect(() => {
    const myInterval = setInterval(() => {
        NotificationService.getNotifications(0,6, false).then(r => {
            if(r === undefined || r === null) return;
            setSize(r.data.totalElements);
            let arr = r.data.content;
            if(arr.length == 0){
              setNoti([]);
            }
            let re =  [...arr];
            let flag = false;
            for(let i = 0; i < arr.length; i++){
              if(arrPre.length == 0 || arrPre[i] === undefined || arrPre[i].id != arr[i].id){
                let x = {
                  id: arr[i].id,
                  idOrder: arr[i].idOrderedItem,
                  idQuo: arr[i].idQuotation,
                  idUser: arr[i].idUser,
                  boCode: arr[i].boCode,
                  color: "secondary",
                  type: "notification",
                  message: arr[i].content + " có mã BBG:" + arr[i].boCode
                }
                re[i] = x;
                flag = true;
              }
            }
            if(flag){
              arrPre = re;
              setNoti(arrPre);
            }
      })
    }, 2000);
    return () => {
      clearInterval(myInterval);
    };
}, []);
  function gotoDetailOrder(idQ, idOrder, idUser, boCode){
    setNotificationsMenu(null);
    if(isEngineering){
      NotificationService.deleteByIdQuotation(idOrder);
      props.history.push(`/app/orders/${boCode}`);
      return;
    } else {
      props.history.push(`/app/order/${idQ}/${idOrder}/${idUser}`);
    }
  }

  function handleChangePassword(){
    setOpenResetPassword(true);
  }

  function goToNotification(){
    props.history.push(`/app/notifications`);
  }
  return (
    <AppBar position="fixed" className={classes.appBar} style={{background: "#585757"}}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Công ty TNHH cơ khí - thương mại LÊ DUYÊN ANH
        </Typography>
        <div className={classes.grow} />
        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={e => {
            setNotificationsMenu(e.currentTarget);
            setIsNotificationsUnread(false);
          }}
          className={classes.headerMenuButton}
        >
          <Badge
            badgeContent={size}
            color="warning"
          >
            <NotificationsIcon classes={{ root: classes.headerIcon }} />
          </Badge>
        </IconButton>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="notifications-menu"
          open={Boolean(notificationsMenu)}
          anchorEl={notificationsMenu}
          onClose={() => setNotificationsMenu(null)}
          className={classes.headerMenu}
          disableAutoFocusItem
        >
          {noti.map((x, index) => (
            <MenuItem
              key={index}
              onClick={() => gotoDetailOrder(x.idQuo, x.idOrder, x.idUser, x.boCode)}
              className={classes.headerMenuItem}
            >
              <Notification {...x} typographyVariant="inherit" />
            </MenuItem>
          ))}
          <MenuItem  key={100} className={classes.headerMenuItem} onClick={goToNotification}>
            <Notification  message={(size == 0) ? "Không có thông báo mới" :  size  + " thông báo chưa xem"} dividers typographyVariant="inherit" />
          </MenuItem>
        </Menu>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h5" weight="medium">
              Tài Khoản:{localStorage.getItem('username')}
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="primary"
              href="https://flatlogic.com"
            >
              Họ tên:{localStorage.getItem('email')}
            </Typography>
          </div>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
            onClick={handleChangePassword}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Đổi mật khẩu
          </MenuItem>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => signOut(userDispatch, props.history)}
            >
              Đăng Xuất
            </Typography>
          </div>
        </Menu>
        <ResetPasswordComponent open={openResetPassword} setOpen={setOpenResetPassword} idUser={null}/>
      </Toolbar>
    </AppBar>
  );
}
