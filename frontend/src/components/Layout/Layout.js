import React, {useState} from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  useRouteMatch,
} from "react-router-dom";
import classnames from "classnames";
// styles
import useStyles from "./styles";
import './layout.css';
// components
import Header from "../Header";
import Sidebar from "../Sidebar";
import BannerVi from './banner_vi.png';
import LogoVi from './logo_vi.png';
// pages
import SuppliesComponent from "../../pages/supplies/SuppliesComponent";
import AccountsComponent from '../../pages/accounts/AccountsComponent';
import QuotationsComponent from '../../pages/quotations/QuotationsComponent';
import OrdersComponent from '../../pages/orders/OrdersComponent';
import DetailOrderComponent from '../../pages/orders/DetailOrderComponent';
import NotificationComponent from '../../pages/notifications/NotificationComponent';
// context
import { useLayoutState } from "../../context/LayoutContext";
import {useUserState} from "../../context/UserContext";
function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  let { path } = useRouteMatch();
  let {isEngineering, isManager, isAdmin } = useUserState();
  let [isShowFooter, setShowFooter] = useState(true);
  return (
    <div className={classes.root} style={{minHeight:"100%", position:"relative"}}>
          <Header history={props.history}/>
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
            style={{paddingBottom: "40px"}}
          >
            <div className={classes.fakeToolbar} />
              <Switch>
                      <PrivateRoute exact path={`${path}/accounts`}  component = {AccountsComponent}/>
                      <PrivateRoute exact path={`${path}/notifications`} component={NotificationComponent}/>
                      <PrivateRoute exact path={`${path}/orders`} component={OrdersComponent}/>
                      <PrivateRoute exact path={`${path}/orders/:boCode`} component={OrdersComponent}/>
                      <PrivateRoute exact path={`${path}/order/:idQuotation`} component={DetailOrderComponent}/>
                      <PrivateRoute exact path={`${path}/order/:idQuotation/:idOrder/:idUser`} component={DetailOrderComponent}/>
                      <PrivateRoute exact path={`${path}/quotations`} component={QuotationsComponent}/>
                      <PrivateRoute exact path={`${path}/supplies`} component={SuppliesComponent}/>
              </Switch>
            </div>
            {
                isShowFooter && 
              <div style={{position: "absolute", bottom: "10px", width: "100%", height:"30px", paddingLeft:"200px", paddingRight:"20px"}}>
                <div class="header_top">
                  <div class="banner w-clear">
                      <div class="logo">
                          <a href="http://leduyenanh.vn/">
                              <img src={LogoVi} alt="Logo" class=""/>
                          </a>
                      </div>

                      <div class="banner-m fl w-clear">   
                          <div class="banner-img ">
                            <img src={BannerVi} alt="Banner"/>
                          </div>
                      </div> 
                        
                  </div>
                  <div class="inf_header">
                      <p>Hotline: <span> (+84)28 38970139</span></p>
                      <p>Email: <span>leduyenanhlda@gmail.com</span></p>
                  </div>
                </div>
              </div>
}
    </div>
  );
  function PrivateRoute({ component, path, ...rest }) {
    let isValidUrlForRole = true;
    if(path.includes('/order/')){
      setShowFooter(false);
    }
    else{
      setShowFooter(true);
    }
    if(isManager){
        if(path === '/app/accounts' || path === '/app/orders'){
          isValidUrlForRole = false;
        }
    } else if(isEngineering){
        if(path === '/app/quotations' || path === '/app/accounts' || path === '/app/supplies'){
          isValidUrlForRole = false;
        }
    } else if(isAdmin){
      if(path === '/app/orders'){
          isValidUrlForRole = false;
      }
    }
    return (
        <Route
            {...rest}
            render={props =>
                isValidUrlForRole ? (
                React.createElement(component, props)
                ) : (
                <Redirect
                    to={{
                    pathname: "/error",
                    state: {
                        from: props.location,
                    },
                    }}
                />
                )
            }
            />
        );
}
}

export default withRouter(Layout);
