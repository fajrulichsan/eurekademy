import React, {Fragment, useState} from 'react'
import Button from '../../component/Button';
import style from "./css/login.module.css"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [alertMessage, setAlertMessage] = useState({
    email : "",
    password : ""
  })

  const [loginData, setLoginData] = useState({
    email : "",
    password : ""
  })

  const handleInput = (e) =>{
    const loginDataCopy = {...loginData};
    loginDataCopy[e.target.name] = e.target.value;
    setLoginData(loginDataCopy);

    //validate
    validateInput(e.target.name, e.target.value)

  }

  const validateInput = (name, value) =>{
    var alertMessageCopy = {...alertMessage};
    if(value.length === 0){
      alertMessageCopy[name] = 'Pleas Input required';
      setAlertMessage(alertMessageCopy);
    }else{
      alertMessageCopy[name] = '';
      setAlertMessage(alertMessageCopy);
    }
  }

  const submit = async () =>{

  }


  return (
    <Fragment>
    <div>
      <div className='space-x-5'>
        <label htmlFor='email'>Email</label>
        <input 
          id='email' 
          name='email' 
          type="text" 
          onChange={(e) => handleInput(e)}
          className={style.input}>
        </input>
        {alertMessage.email && (
          <p className={style.alert}>{alertMessage.email}</p>
        )}
      </div>
      <div className='space-x-5'>
        <label 
          htmlFor='password'>
          Password
        </label>
        <input 
          id='password' 
          name='password' 
          type={showPassword ? "text" : "password"} 
          onChange={(e) => handleInput(e)}
          className={style.input}>
        </input>
        {alertMessage.password && (
          <p className={style.alert}>{alertMessage.password}</p>
        )}
      </div>
      <div>
        <input 
          id='showPassword' 
          type="checkbox"
          onChange={() => setShowPassword(!showPassword)}
        >
        </input>
        <label 
          htmlFor='showPassword'
         >
          Show password
        </label>
      </div>
     
      <Button 
        onClick={submit} 
        text="Submit" 
        className="bg-blue-200"
      />
    </div>
    </Fragment>
  )
}

export default Login;