import React,  { useEffect, useState } from 'react';
import { getUserGroups, createGroup, fetchGroup, fetchJoinList, joinGroup } from '../database/firebase'
import Menu from '../components/menu'
import { Formik, Form as Formk ,Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import Leaderboard from '../components/leaderboard';

const initialValues = {
  groupName: '',
  imgURL: '',
  challenge: '',
}

const validationSchema = yup.object({
  groupName: yup.string().required('Required'),
  imgURL: yup.string().url("Must be an image link"),
  challenge: yup.string().required('Required')
})

function Groups({user}){

    const [loading, setLoading] = useState(true);
    const [pulled, setPulled] = useState(false);
    const [groups, setGroups] = useState([]);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [join, setJoin] = useState(-1);
    const [groupData, setGroupData] = useState([])
    const [joinList, setJoinList] = useState([])
    useEffect(() => {
        setSelected(-1)
        if (!pulled) {
            getUserGroups(user, (retrivedData) => {
              console.log(retrivedData);
              if (retrivedData) {
                setGroups(retrivedData);
                if(retrivedData.length === 1) {
                  setGroups(["Join some groups to get started! ;)"])
                }else {
                  setGroups(retrivedData.slice(1))
                  for(let i = 1; i < retrivedData.length; i++){
                    fetchGroup(retrivedData[i], (data) => {
                      setGroupData(arr => [...arr, data])
                    })
                  }
                  
                }
                setPulled(true);
                setLoading(false);
              }else{
                setLoading(false)
              }
            });
          }
          return () => {
            setSelected(0); // This worked for me
          };
    }, []);

    const createGroupHandler = () => {
      setCreating(true)
      setJoining(false)
    }

    const joinGroupHandler = () => {
      // diff = A.filter(x => !B.includes(x) ); only join new groups
      fetchJoinList((retrievedData) => {
        setJoinList(retrievedData)
      })
      setJoining(true)
      setCreating(false)
    }

    const selectJoinHandler = (id, e) => {
      
      setJoin(id)
    }

    const selectGroupHandler = (id, e) => {
      setSelected(id)
    }

    function confirmJoin() {
      if(join !== -1){
        let data = {name: user.displayName, uid: user.uid, groupName: joinList[join]}
        joinGroup(data)
        setJoining(false)
      }else {
        alert("Please Select a Group to join")
      }
    }

    function openBar() {
      document.getElementById("sidebar").style.display = "block";
    }

    function closeBar() {
      document.getElementById("sidebar").style.display = "none";
    }

    const onSubmit = (values, submitProps) => {
      setCreating(false)
      console.log('Form data', values)
      let data = {
        uid: user.uid,
        groupName: values.groupName,
        sendData: {
          members: [
            user.displayName,
          ],
          challenge: values.challenge,
          banner: values.imgURL,
          leaderboard: [
            { name: user.displayName, score: 0 }
          ],
          owner: user.displayName
        }
      }
      createGroup(data)
      submitProps.resetForm();
      alert('Group Created!')
    }


    return(
        <div className="group">
            { loading ? 
            <div id="sidebar" className="sidebar">
              <button className="close-bar" onClick={closeBar}>Close &times;</button>
              <p>:( No Groups</p>
            </div>
            :
            <div id="sidebar" className="sidebar">
              <button className="close-bar" onClick={closeBar}>Close &times;</button>
              <ul className="grouplist"> 
                  {groups.map((element,id) => <li key={element}><button className="grouplist-elements" onClick={(e) => selectGroupHandler(id, e)}>{element}</button></li>)}
              </ul>
            </div>
            }
            <div className="groups-header"><button onClick={openBar} className="open-bar">☰</button> <h1 className="title">Groups</h1></div>
            <span className="username">{'See your groups below, ' + (user.displayName).split(' ')[0]}</span>
            <div>
              <button className="group-btn" onClick={createGroupHandler}>Create</button>
              <button className="group-btn" onClick={joinGroupHandler}>Join</button>
            </div>
            { creating ?
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                    values
                }) => (
                <Formk className="formk">
                  <div className="form-field">
                    <label htmlFor="group-name" className="form-label">Group Name:</label>
                    <Field type='text' id='groupName' name='groupName' className="form-input"/>
                    <ErrorMessage name='groupName'>{msg => <div className="error-msg">{msg}</div>}</ErrorMessage>
                  </div>
                  <div className="form-field">
                    <label htmlFor="image-url" className="form-label">Group Image Link:</label>
                    <Field type='text' id='imgURL' name='imgURL' className="form-input"/>
                    <ErrorMessage name='imgURL'>{msg => <div className="error-msg">{msg}</div>}</ErrorMessage>
                  </div>
                  <div className="form-field">
                    <label htmlFor="challenge" className="form-label">Challenge:</label>
                    <Field type='text' id='challenge' name='challenge' className="form-input"/>
                    <ErrorMessage name='challenge'>{msg => <div className="error-msg">{msg}</div>}</ErrorMessage>
                  </div>
                  <button className="todo-button" type="submit">
                          <h1 className="add-event">Submit</h1>
                          <i className="fas fa-check"></i>
                  </button>
                  <button className="cancel" onClick={() => setCreating(false)}>&times;</button>
                </Formk>
                )}
              </Formik>
            :
            <></>
            }
            { joining ? 
            <div className="join-panel">
              <div className="bullet-list">
              {joinList.map((element,id) => <li className="bullet" key={element}><button className="groups-to-join" onClick={(e) => selectJoinHandler(id, e)}>{element}</button></li>)}
              </div>
              <button className="confirm" onClick={confirmJoin}>Confirm</button>
              <button className="cancel" onClick={() => setJoining(false)}>&times;</button>
            </div>
            :
            <></>
            }
            { selected === -1 ? 
              <></>
            :
              <div className="group-leaderboard">
                <p>{groupData[selected].challenge}</p>
                <img src={groupData[selected].banner} alt="banner" height="50"/>
                <Leaderboard data={groupData[selected].leaderboard}/>
              </div>
            }
            <Menu user={user}/>
        </div>
    )
}

export default Groups;