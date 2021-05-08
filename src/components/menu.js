import React from 'react'

function Menu({user}) {

    return (
        <div className="menu">
            <a className="action-group" href="/logout"><img src={user.photoURL} className="propic" alt="pp" /></a>
            <div className="stick"> </div>
            <a className="action-group" href="/dashboard"><i className="fas fa-globe-americas"></i></a>
            <div className="stick"> </div>
            <a className="action-group" href="/groups"><i className="fas fa-users"></i></a>
        </div>
    )
}

export default Menu;