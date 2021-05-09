import React, { useEffect, useState } from 'react';
import { fetchGlobalLeaders, fetchGlobalChallenges, getUserData } from '../database/firebase' 
import earth from '../assets/earth.svg'
import Menu from '../components/menu'

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
      console.log("check")
      if(clicked){
        console.log("check2")
        document.getElementByID("one-time").innerHTML = "Pick up trash";
        document.getElementByID("unlimited").innerHTML = "Plant a Tree";
      }
    }

    function oneTimeButtonClicked() {
      
    }

    function unlimitedButtonClicked() {
      
    }

    return(
        <div className="dashboard">
            <img src={earth} alt="earth" className="icon"/>
            <button onClick={() => buttonClicked} className='global-challenges'>View Weekly Challenges</button>
            <button onClick={() => oneTimeButtonClicked} className="global-challenges one-time" id='one-time'>Pick Up 10 Pieces of Trash</button>
            <button onClick={() => unlimitedButtonClicked} className="global-challenges unlimited" id='unlimed'>Plant a Tree</button>
            <h1 className="title">Leaderboard</h1>
            <div id="HASH" className="blue-msg">
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
            <table className="leaderboard"> 
              <tbody>
                {leaderboard.map((element,index) => 
                <tr className="entry" key={element.name}> 
                  <td>{`${index+1}.`}</td> 
                  <td className="leaderName">{`${element.name} `}</td>  
                  <td className="scores">{`${element.score} pts`}</td>
                </tr>
              )}
              </tbody>
            </table>
            }
            <div className="user">
            . {`${user.displayName} `}  pts
            </div>
            <Menu user={user}/>
        </div>
    )
}

export default Dashboard;