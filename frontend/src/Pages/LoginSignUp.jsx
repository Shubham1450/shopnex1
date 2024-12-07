import React, { useState } from 'react'
import './CSS/Loginsignup.css'
const LoginSignUp = () => {
    const [state, setState] = useState('Login');
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })
    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const login = async () => {
        console.log("Login fn exc", formData);
        console.log("Sign up", formData);
        let responseData;
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => responseData = data)
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        }
        else {
            alert(responseData.error)
        }
    }


    const signUp = async () => {
        console.log("Sign up", formData);
        let responseData;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((data) => responseData = data)
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        }
        else {
            alert(responseData.error)
        }
    }


    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' /> : <></>}
                    <input type="email" name="email" value={formData.email} onChange={changeHandler} id="" placeholder='Email' />
                    <input type="password" name="password" value={formData.password} onChange={changeHandler} placeholder='Password' />
                </div>
                <button onClick={() => { state === "Login" ? login() : signUp() }}>Continue</button>
                {state === "Sign Up" ? <p className="loginsignup-login">Already Have An Account? <span onClick={() => { setState('Login') }} style={{ cursor: "pointer" }}>Login Here</span></p> : <p className="loginsignup-login">Create An Account <span onClick={() => { setState('Sign Up') }} style={{ cursor: "pointer" }}>Click Here</span></p>}

                <div className="loginsignup-agree">
                    <input type="checkbox" name="" id="" />
                    <p>By continuisng , i agree to the terms of use & service</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignUp