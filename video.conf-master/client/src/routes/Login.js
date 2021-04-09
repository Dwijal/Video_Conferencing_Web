import React,{useState,useRef,useEffect, Component} from "react";
import {GoogleLogin} from "react-google-login"
import styled from "styled-components";
import {Link} from "react-router-dom";

const Pa=styled.p`
color:black;
`
const Login=(props)=>{
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [imgurl,setImgurl]=useState("")
    function responseGoogle(response){
        setName(response.profileObj.name)
        setEmail(response.profileObj.email)
        setImgurl(response.profileObj.imageUrl)
        console.log(response)
     
        
    }
    function onFailure(response){
        setName("")
        setEmail("")
        console.log(response)
        alert("Invalid Credentials\n Please try Again")
    }

    return(
        <div>
            <GoogleLogin
    clientId="89716141198-ce0j9e8agn9j070ve94onk1gin5pafn1.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
    isSignedIn={true}
  />
  
  />

  <Pa>{name}</Pa>
  <Pa>{email}</Pa>
        </div>
    )
}






export default Login