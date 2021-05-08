import React from 'react';
import logo from '../assets/Nature_Clash.png';
import leaves from'../assets/Leaves.png';
import '../App.css';


function Home(){

    return(
        <div className="home">
            <img src={logo} className="logo" alt="logo"/>
            
            <a className="nav-link" href="/login">
                    Get Started
            </a>

            <img src={leaves} className="leaves" alt="leaves" />
        </div>
    )
}

export default Home;