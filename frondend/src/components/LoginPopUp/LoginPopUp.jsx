import React, { useContext, useEffect, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'


const LoginPopUp = ({setShowLogin}) => {
   
   const {url, setToken} = useContext(StoreContext)
    const [currentState, setCurrentState] = useState("Login")
    const [data, setData] = useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;

        setData(data =>({...data, [name]:value}))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
    
        if (currentState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }
    
        try {
            // Log the request data and URL for debugging
            console.log("Sending data to:", newUrl);
            console.log("Data being sent:", data);
    
            // Make the POST request with the correct data format
            const response = await axios.post(newUrl, data);
    
            // Log the response for debugging
            console.log("Response received:", response);
    
            // Check for success and handle token
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);  // Close the login popup
            } else {
                alert(response.data.message);  // Show error message if unsuccessful
            }
        } catch (error) {
            // Log the error details for more information
            console.error("Error occurred:", error);
    
            // If the error has a response from the server, log it
            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Error Status:", error.response.status);
                console.error("Error Headers:", error.response.headers);
            } else if (error.request) {
                // If the request was made but no response received
                console.error("Error Request Data:", error.request);
            } else {
                // Something else happened while setting up the request
                console.error("General Error:", error.message);
            }
    
            alert("An error occurred. Please check the console for details.");
        }
    };
    
    useEffect(()=>{
        console.log(data)
    }, [data])

  return (
   <div className="login-popup">
    <form  onSubmit={onLogin} className="login-pop-container">
        <div className="login-pop-title">
            <h2>{currentState}</h2>
            <img onClick={() =>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-pop-inputs">
        {currentState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required/>}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type='submit' >{currentState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-pop-condition">
            <input type="checkbox" required />
            <p>By Continuing, I agree with the terms of use & privacy policy.</p>
        </div>
        {currentState==="Login"? 
        <p>Create a new account? <span onClick={() =>setCurrentState("Sign Up")}>Click here</span></p>:
        <p>Already have an account? <span onClick={() =>setCurrentState("Login")}>Login here</span></p>
    }
    </form>
   </div>
  );
}

export default LoginPopUp;
