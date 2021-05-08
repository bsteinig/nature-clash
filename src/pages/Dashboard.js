import React, { useEffect, useState } from 'react';
import { getGlobalLeaders } from '../database/firebase' 

function Dashboard({user}){

    const [loading, setLoading] = useState(false);
    const [pulled, setPulled] = useState(false);
    const [leaderboard, setLeaderboard] = useState({});
    useEffect(() => {
        if (!pulled) {
            getGlobalLeaders(user, (retrivedData) => {
              console.log(retrivedData);
              if (retrivedData) {
                setLeaderboard(retrivedData)  
                setPulled(true);
                setLoading(false);
              }else{
                setLoading(false)
              }
            });
          }
    }, []);

    return(
        <div className="home">
            <h1  className="title">Leaderboard</h1>
            <span className="log-tag">Welcome Back, <span className="username">{user.displayName}</span></span>
            <img alt="user profile" className="propic" src={user.photoURL}width="32" height="32"/>
            <a className="action-group" href="/groups">See Groups</a>
            { loading ? 
            <></>
            :
            <ul> 
                {leaderboard.map(element => <li key={element}>{element}</li>)}
            </ul>
            }
            <a className="nav-link" href="/logout">
                    Logout
            </a>
        </div>
    )
}

export default Dashboard;