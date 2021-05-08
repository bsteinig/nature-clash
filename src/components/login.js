import React, {useEffect} from 'react' 
import { Redirect } from 'react-router-dom'
import { signInWithGoogle, logOut } from '../database/firebase'

function Login({user, setUser}){
    if(user){
        return <Redirect to="/dashboard"/>    }

    return (
        <div className="login-page">
            <div className="logo-box">
                <h3 className="import-txt">Sign In to Continue</h3>
                <div className="row">
                    <div className="col-md-12 g-btn"> <button onClick={() => {signInWithGoogle(setUser)}} className="btn btn-lg btn-google btn-block text-uppercase btn-outline"><img alt="google" src="https://img.icons8.com/color/16/000000/google-logo.png"></img> Login with Google</button> </div>
                </div>
            </div>
        </div>
    );
}

export default Login;


export function Logout({setuser}){
    // const user = useContext(UserContext)
    useEffect(() => {
        logOut(setuser);
    }, [setuser])
    
    return <Redirect to="/"/>
    
}