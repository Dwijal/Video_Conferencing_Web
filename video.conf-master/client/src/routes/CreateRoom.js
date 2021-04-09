import React,{useEffect,useState} from "react";
import { v1 as uuid } from "uuid";
import {GoogleLogin} from "react-google-login";
import {Link} from "react-router-dom";
import "./CreateRoom.css"
const CreateRoom = (props) => {
    
   
    function create() {
        const id = uuid();
        props.history.push({
            pathname:`/room/${id}`,
            data:{
                name:name,
                email:email,
                imgurl:imgurl,
            }
        });
    }

    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [imgurl,setImgurl]=useState("")
    const [newID,setNewID]=useState("")
    const [loggedin,setLoggedin]=useState(false)
    function responseGoogle(response){
        setName(response.profileObj.name)
        setEmail(response.profileObj.email)
        setImgurl(response.profileObj.imageUrl)
        console.log(response)
        setLoggedin(true)
        

    }
    function onFailure(response){
        setName("")
        setEmail("")
        console.log(response)
        alert("Invalid Credentials\n Please try Again")
    }
    const handleNewID=(e)=>setNewID(e.target.value)

    function join(e)
    {
        e.preventDefault()
        props.history.push({
            pathname:`/room/${newID}`,
            data:{
                name:name,
                email:email,
                imgurl:imgurl,
            }
        })
        
    }


    return(   
        <div class="hello">
      <navbar class="nav">
        <header class="icon">
          <p>Meet App</p>
        </header>
        <header class="links">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#home">About</a>
            </li>
            <li>
              <a href="#home">Contact Us</a>
            </li>
          </ul>
        </header>
        <header class="signin" style={loggedin ? {display:'none'}:{display:'block'}}>
        <GoogleLogin
            clientId="89716141198-ce0j9e8agn9j070ve94onk1gin5pafn1.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            />
        </header>
        <header style={loggedin ? {display:'block'}:{display:'none'}} >
            <div style={{display:'flex'}}>
                <h4 style={{color:"white"}}>{name}</h4>
                <img class="small" src={imgurl} />
            </div>
        </header>
      </navbar>
      <div class="main">
      <div class="contain">
        <div class="shape">
          <p>Click here To Create the Room</p>
          <button class="btn-primary" onClick={create}>
            Create room
          </button>
        </div>

        <div class="shape">
          <p>Join An Existing Room</p>
          <div style={{alignItems:"center"}}>
          <form>
            <input class="newIDinput" value={newID} onChange={handleNewID} /><br />
          <button class="btn-primary" onClick={join}>
            Join Room
          </button>
          </form>
          </div>
          
        </div>
        </div>
        
    </div>
    </div>
    )
    
};

export default CreateRoom;
