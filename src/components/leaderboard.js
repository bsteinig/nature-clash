import React from 'react'

function Leaderboard({data}) {

    return (  
        <table className="leaderboard"> 
              <tbody>
                {data.map((element,index) => 
                <tr className="entry" key={element.name}> 
                  <td>{`${index+1}.`}</td> 
                  <td className="leaderName">{`${element.name} `}</td>  
                  <td className="scores">{`${element.score} pts`}</td>
                </tr>
              )}
              </tbody>
        </table>
    )

}

export default Leaderboard;