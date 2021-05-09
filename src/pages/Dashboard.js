import React, { useEffect, useState } from 'react';
import { fetchGlobalLeaders, fetchGlobalChallenges, getUserData, addGlobalScore } from '../database/firebase' 
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
    const [userIndex, setUserIndex] = useState(0);

    useEffect(() => {
      if (!pulled) {
        fetchGlobalLeaders((retrivedData) => {
          if (retrivedData) { 
            retrivedData.sort((a,b) => (a.score > b.score) ? -1 : 1)
            setLeaderboard((retrivedData)) 
            let obj = retrivedData.find((o, i) => {
              if (o.name === user.displayName) {
                  setUserIndex(i)
                  return true; // stop searching
              }
            });
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

    function oneTimeButtonClicked() {
      let data = { name: user.displayName, score: 100 }
      addGlobalScore(data)
      console.log('here')
      document.getElementById('one-time').style.visibility = 'hidden'
    }

    function unlimitedButtonClicked() {
      let data = { name: user.displayName, score: 5 }
      addGlobalScore(data)
    }

    function displayChallenges() {
      if(clicked) {
        return <div className ="global-chal">
          <button onClick={() => unlimitedButtonClicked()} className="global-challenges unlimited" id='unlimited'>Pick Up 10 Pieces of Trash - 5 pts</button>
          <button onClick={() => oneTimeButtonClicked()} className="global-challenges one-time" id='one-time'>Plant a Tree - 100 pts</button>
        </div>
      }
    }

    return(
        <div className="dashboard">
            <img src={earth} alt="earth" className="icon"/>
            
            {clicked ? <button onClick={() => buttonClicked()} className='global-challenges'>Hide Weekly Challenges</button>
            : <button onClick={() => buttonClicked()} className='global-challenges'>View Weekly Challenges</button>}
            {displayChallenges()}

            <h1 className="title-dash">Leaderboard</h1>
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
            <div>
              <Leaderboard data={leaderboard}/>
              <div className="user">
                  {`${userIndex+1}`}. {`${user.displayName} `}  {`${leaderboard[userIndex].score}`}pts
              </div>
            </div>
            }
            
            <Menu user={user}/>
        </div>
    )
}

export default Dashboard;