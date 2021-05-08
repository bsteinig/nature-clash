import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from './privateRoute'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import NotFoundPage from './pages/404'
import SignInPage, {Logout} from './components/login';
import reportWebVitals from './reportWebVitals';


function App() {
  
  const [user, setUser] = useState(null);
  let userTmp = localStorage.getItem("user");
  if(userTmp){
    userTmp = JSON.parse(userTmp)
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={() => <SignInPage user={user} setUser={setUser}/>} />
        <Route exact path="/logout" component={() => <Logout setuser={setUser}/>} />
        <PrivateRoute exact path="/dashboard" user={userTmp} component={() => <Dashboard user={userTmp} />} />
        <PrivateRoute exact path="/groups" user={userTmp} component={() => <Groups user={userTmp} />} />
        <Route exact path="/404" component={NotFoundPage} />
        <Redirect to="/404" /> 
      </Switch>
    </Router>
  );
}

export default App;


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
<PrivateRoute exact path="/create" user={userTmp} component={() => <Create user={userTmp} />} />
<PrivateRoute exact path="/view" user={userTmp} component={() => <View user={userTmp} />} />
<PrivateRoute exact path="/import" user={userTmp} component={() => <Import user={userTmp} />}/>
<PrivateRoute exact path="/edit" user={userTmp} component={() => <Edit user={userTmp} />}/>
*/