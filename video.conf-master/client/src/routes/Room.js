import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import "./Room.css";



const Video = (props) => {
  const ref = useRef();
    const name="";
  useEffect(() => {
    // change done here
    props.peer[0].on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);
  const ans=props.members.filter(mem=>Object.keys(mem)[0]===props.peer[1])
  return (
      <div>
          <video class="vid" playsInline autoPlay ref={ref}></video>
  <h3 class="vidname">{Object.values(ans)[0]}</h3>
      </div>
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const [name, setName] = useState("");
  const [members,setMembers]=useState([])

  const {data}=props.location
  console.log(data)

  // Chat Box Code

  const [yourid, setYourid] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socketRef.current = io.connect("/");

    socketRef.current.on("sending id",id=>setYourid(id))
    socketRef.current.emit("user details",{id:[data.name,data.imgurl]})

    socketRef.current.on("all members",payload=>{
        setMembers(payload)
    })

        // chat box code
        socketRef.current.on("new message",message=>{
            appendMsg(message)
        })

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            // change done here
            peers.push([peer,userID]);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
        //   change done here
          setPeers((users) => [...users, [peer,payload.callerID]]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }
  const handleNameChange = (e) => setName(e.target.value);
  const handleMsgChange = (e) => setMessage(e.target.value);

  const appendMsg=(msg)=>{
    setMessages(oldMsg=>[...oldMsg,msg])
    // const change=messages.filter(msg=>msg.roomid===roomID)
    // setMessages(change)
}
  function sendMessage(e){
    e.preventDefault()
    const messageObject={
        body:message,
        name:name,
        id:yourid,
        roomid:roomID,

    }
    setMessage("")
    socketRef.current.emit("send message",messageObject)
}
window.onload = function () {
    window.location = "http://localhost:3000";
  }

  return (
    <div>
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
        <header >
            <div style={{display:'flex'}}>
                <h4 style={{color:"white"}}>{data.name}</h4>
                <img class="small" src={data.imgurl} />
            </div>
        </header>
        </navbar>

        <div class="room_id_div">
            <h3>Copy This Room ID</h3>
            <textarea rows="1" cols="45" value={roomID}class="roomid"></textarea>
        </div>

      <div class="view">
        <div class="container">
          <div className="user_element">
            <video
              class="vid"
              muted
              ref={userVideo}
              autoPlay
              playsInline
            ></video>
            <h3 class="vidname">{data.name}</h3>
          </div>
          {peers.map((peer, index) => {
            return <Video key={index} peer={peer} members={members} />;
          })}
        </div>

        <div class="chatbox">
          {/* <div class="switchh">
            <a class="btn-primary"> Chats</a>
            <a class="btn-primary">Members</a>
          </div> */}
          <div class="msgs">
                    {

                        messages.map((message,index)=>{
                        if (message.id===yourid)
                        {
                            return(
                            <div class="myMessage" key={index}>
                            <div class="entry">
                            <p><u>{message.name}</u></p>
                            <button >
                            {message.body}
                            </button>
                            </div></div>
                            )
                        }
                        else{
                            return(
                            <div class="partnerMessage" key={index}>
                            <div class="entry">
                                <p><u>{message.name}</u></p>
                                <button >
                                {message.body}
                            </button>
                            </div></div>
                            )
                        }
                        })}
                    </div>
          <form onSubmit={sendMessage}>
            <textarea
              class="txta"
              value={message}
              rows="2"
              placeholder="  Enter Your Message"
              onChange={handleMsgChange}
            />
            <button class="bt ">Send Msg</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Room;
