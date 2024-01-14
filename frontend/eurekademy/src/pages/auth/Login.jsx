import React, { Fragment, useState } from "react";
import Button from "../../component/Button";
import style from "./css/login.module.css";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import {Link} from "react-router-dom";

const Login = () => {
    const { localURL } = useStateContext();
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        email: "",
        password: "",
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleInput = (e) => {
        const loginDataCopy = { ...loginData };
        loginDataCopy[e.target.name] = e.target.value;
        setLoginData(loginDataCopy);

        //validate
        validateInput(e.target.name, e.target.value);
    };

    const validateInput = (name, value) => {
        var alertMessageCopy = { ...alertMessage };
        if (value.length === 0) {
            alertMessageCopy[name] = "Pleas Input required";
            setAlertMessage(alertMessageCopy);
        } else {
            alertMessageCopy[name] = "";
            setAlertMessage(alertMessageCopy);
        }
    };

    const isAvailableSubmit = () => {
        return (
            alertMessage.email.length === 0 &&
            alertMessage.password.length === 0
            && loginData.email.length !== 0 &&
            loginData.password.length !== 0
        );
    };

    const submit = async () => {
        await axios
            .post(`${localURL}/auth/login`, loginData)
            .then((res) => {
                console.log("sign up berhasil");
                console.log(res);
            })
            .catch((err) => {
                // console.log(err);
                const error = err.response.data;
                var alertMessageCopy = { ...alertMessage };
                alertMessageCopy[error.field] = error.message;
                setAlertMessage(alertMessageCopy);
            });
    };

    return (
        <Fragment>
            <div>
                <div className="space-x-5">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        onChange={(e) => handleInput(e)}
                        className={style.input}
                    ></input>
                    {alertMessage.email && (
                        <p className={style.alert}>{alertMessage.email}</p>
                    )}
                </div>
                <div className="space-x-5">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => handleInput(e)}
                        className={style.input}
                    ></input>
                    {alertMessage.password && (
                        <p className={style.alert}>{alertMessage.password}</p>
                    )}
                </div>
                <div>
                    <input
                        id="showPassword"
                        type="checkbox"
                        onChange={() => setShowPassword(!showPassword)}
                    ></input>
                    <label htmlFor="showPassword">Show password</label>
                </div>

                <Button
                    onClick={submit}
                    text="Submit"
                    className={`${style.btnSubmit} ${
                        isAvailableSubmit() ? "" : style.btnDisabled
                    }`}
                    disabled = {!isAvailableSubmit()}
                />

                <Link to="/sign-up">
                    <Button
                        text="Submit"
                        className={`${style.btnSubmit}`}
                    />
                </Link>  
            </div>
        </Fragment>
    );
};

export default Login;
