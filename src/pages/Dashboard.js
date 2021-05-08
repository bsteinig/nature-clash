import React, { useEffect, useState } from 'react';
import { fetchGlobalLeaders } from '../database/firebase' 
import earth from '../assets/earth.svg'
import Menu from '../components/menu'

function Dashboard({user}){

    const [clicked, setClicked] = useState(false);
    const [oneTimeClicked, setOneTimeClicked] = useState(false);
    const [unlimitedClicked, setUnlimitedClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pulled, setPulled] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
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
    } 
    }, []);

    function buttonClicked() {
      setClicked(prevclicked => !prevclicked)
      if(clicked){
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
            <button onClick={() => buttonClicked} className='global-challenges'>see all challenges</button>
            <button onClick={() => oneTimeButtonClicked} className="global-challenges one-time" id='one-time'></button>
            <button onClick={() => unlimitedButtonClicked} className="global-challenges unlimited" id='unlimed'></button>
            <h1 className="title">Leaderboard</h1>
            <div className='bullet-title'>
              <p>Name</p>
              <p>Points</p>
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
                  <td>{`${element.score} pts`}</td>
                </tr>
              )}
              </tbody>
            </table>
            }
            <Menu user={user}/>
        </div>
    )
}

export default Dashboard;