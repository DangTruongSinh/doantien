import React, {useState} from "react";
import './vendor/bootstrap/css/bootstrap.min.css';
import './fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import './vendor/animate/animate.css';
import './vendor/css-hamburgers/hamburgers.min.css';
import './vendor/select2/select2.min.css';
import './css/util.css';
import './css/main.css';
import logo from './images/logo.png';
import { useUserDispatch, loginUser } from "../../../context/UserContext";

import Loader from '../../../components/loader';
export default function LoginCustom(props) {
    var userDispatch = useUserDispatch();
    var [loginValue, setLoginValue] = useState("");
    var [passwordValue, setPasswordValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    let [load, setLoad] = useState(false);
    return(
        <div class="limiter">
            <div class="container-login100">
                <div class="wrap-login100" style={{paddingBottom:"150px"}}>
                    <div class="login100-pic js-tilt" style={{width: "420px"}}>
                        <img src={logo} alt="IMG" style={{height: "280px"}}/>
                    </div>
                    <div className="login100-form validate-form">
                        <span class="login100-form-title" style={{paddingBottom:"20px"}}>
                            <b>Đăng Nhập Thành Viên</b>
                        </span>
                        { 
                            isValid &&  <h4 style ={{paddingBottom: "20px", fontStyle:"italic", textAlign: "center", color: "red"}}>Thông tin đăng nhập sai</h4>
                        }
                        { !isValid && <h4 style ={{paddingBottom: "20px", visibility:"hidden"}}>aa</h4>}
                        <div className="wrap-input100 validate-input">
                            <input className="input100" type="text" name="email" placeholder="Tài khoản" value={loginValue} onChange={e => setLoginValue(e.target.value)}/>
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div class="wrap-input100 validate-input">
                            <input class="input100" type="password" name="pass" placeholder="Mật Khẩu" value = { passwordValue } onChange = { e => setPasswordValue(e.target.value) }/>
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-lock" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div class="container-login100-form-btn">
                            <button class="login100-form-btn" onClick = {
            () => loginUser(userDispatch, loginValue, passwordValue, props.history, setIsValid, setLoad)  }>
                                Đăng Nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {load && <Loader/>} 
        </div>

    );
}