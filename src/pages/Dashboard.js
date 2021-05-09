import React, { useEffect, useState } from 'react';
import { fetchGlobalLeaders, fetchGlobalChallenges, getUserData } from '../database/firebase' 
import earth from '../assets/earth.svg'
import Menu from '../components/menu'
import Leaderboard from '../components/leaderboard';

function Dashboard({user}){

    const [clicked, setClicked] = useState(false);
    const [oneTimeClicked, setOneTimeClicked] = useState(false);
    const [unlimitedClicked, setUnlimitedClicked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pulled, setPulled] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [challenges, setChallenges] = useState([]);
    useEffect(() => {
      if (!pulled) {
        fetchGlobalLeaders((retrivedData) => {
          if (retrivedData) { 
            retrivedData.sort((a,b) => (a.score > b.score) ? -1 : 1)
            setLeaderboard((retrivedData)) 
            setPulled(true);
            setLoading(false);
          }else{
            setLoading(false)
          }
        });
        fetchGlobalChallenges((retrivedData) => {
          setChallenges(retrivedData)
        })
    } 
    }, []);

    function buttonClicked() {
      setClicked(prevclicked => !prevclicked)
    }

    function displayChallenges() {
      if(clicked) {
        return <div className ="global-chal">
          <button onClick={() => oneTimeButtonClicked} className="global-challenges one-time" id='one-time'>Pick Up 10 Pieces of Trash - 5 pts</button>
          <button onClick={() => unlimitedButtonClicked} className="global-challenges unlimited" id='unlimed'>Plant a Tree - 100 pts</button>
        </div>
      }
    }

    function oneTimeButtonClicked() {
      
    }

    function unlimitedButtonClicked() {
      
    }

    return(
        <div className="dashboard">
            <img src={earth} alt="earth" className="icon"/>
            
            {clicked ? <button onClick={() => buttonClicked()} className='global-challenges'>Hide Weekly Challenges</button>
            : <button onClick={() => buttonClicked()} className='global-challenges'>View Weekly Challenges</button>}
            {displayChallenges()}

            <h1 className="title">Leaderboard</h1>
            <div id="HASH" className="leaderboard-element-titles">
              <div id="left">
                <span id="time-HASH" className="smalltext">Name</span>
              </div>
              <div id="right">
                <span className="ios-circle">Points</span>
              </div>
            </div>
            { loading ? 
            <></>
            :
            <Leaderboard data={leaderboard}/>
            }
            <div className="user">
            . {`${user.displayName} `}  pts
            </div>
            <Menu user={user}/>
        </div>
    )
}

export default Dashboard;