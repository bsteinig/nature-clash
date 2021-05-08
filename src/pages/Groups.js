import React,  { useEffect, useState } from 'react';
import { getUserGroups } from '../database/firebase'

function Groups({user}){

    const [loading, setLoading] = useState(false);
    const [pulled, setPulled] = useState(false);
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        if (!pulled) {
            getUserGroups(user, (retrivedData) => {
              console.log(retrivedData);
              if (retrivedData) {
                setGroups(retrivedData);
                if(retrivedData[0] === user.uid) setGroups([]);
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
            <h1  className="title">Groups</h1>
            <span className="log-tag">See your groups below, <span className="username">{user.displayName}</span></span>
            <img alt="user profile" className="propic" src={user.photoURL}width="32" height="32"/>
            { loading ? 
            <></>
            :
            <ul> 
                {groups.map(element => <li key={element}>{element}</li>)}
            </ul>
            }
            <a className="nav-link" href="/dashboard">
                    Go Home
            </a>
        </div>
    )
}

export default Groups;