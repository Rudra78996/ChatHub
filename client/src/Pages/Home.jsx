import React  from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Home.css";
import { Link } from "react-router-dom";



function Home(){
    return (
        <div className="container">
            <header>
                <div id="heading">
                    <h1 id="heading1">
                        <div className="chat">Chat</div>
                        <div className="hub">Hub</div>
                    </h1>
                    
                </div>
                <nav>
                    <ul>
                        
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <h2>Talk To Strangers Around The World</h2>
                <p>ChatHub lets you video call random strangers, giving you the chance to make new friends, and more – all in one place.</p>
                <button className="start-chat">START CHAT</button>
                <div className="chat-options">
                    <a href="#" className="chat-button text"><Link to="/chat" style={{textDecoration: "none",color:"white"}}>Chat</Link></a>
                    <span>OR</span>
                    <a href="#" className="chat-button video"><Link to="/room" style={{textDecoration: "none" ,color:"white"}}>Video</Link> </a>
                </div>
                <a href="" className="uncensored"><Link to="/groupChat" style={{textDecoration: "none", color:"white"}}>Group Chat</Link></a>
                <p className="age-restriction">You must be 18 years or older to use ChatHub.</p>
                {/* <p className="online-count">(Strangers Online: 184)</p> */}
                <a href="#" className="guidelines">Read Community Guidelines</a>
            </main>
        </div>
    );
}



export default Home;
