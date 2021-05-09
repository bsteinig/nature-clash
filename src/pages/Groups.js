import React,  { useEffect, useState } from 'react';
import { getUserGroups } from '../database/firebase'
import Menu from '../components/menu'
import { Formik, Form as Formk ,Field, ErrorMessage } from 'formik'
import * as yup from 'yup'

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
    useEffect(() => {
        if (!pulled) {
            getUserGroups(user, (retrivedData) => {
              console.log(retrivedData);
              if (retrivedData) {
                setGroups(retrivedData);
                if(retrivedData[0] === user.uid) setGroups(["Join some groups to get started! ;)"]);
                setPulled(true);
                setLoading(false);
              }else{
                setLoading(false)
              }
            });
          }
    }, []);

    const createGroupHandler = () => {
      setCreating(true)
    }

    const onSubmit = (values, submitProps) => {
      setCreating(false)
      console.log('Form data', values)
      alert('Group Created!')
    }


    return(
        <div className="home">
            <h1  className="title">Groups</h1>
            <span className="log-tag">See your groups below, <span className="username">{(user.displayName).split(' ')[0]}</span></span>
            <div>
              <button className="group-btn" onClick={createGroupHandler}>Create</button>
              <button className="group-btn">Join</button>
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
                </Formk>
                )}
              </Formik>
            :
            <></>
            }
            { loading ? 
            <div></div>
            :
            <ul className="grouplist"> 
                {groups.map(element => <li key={element}>{element}</li>)}
            </ul>
            }
            
            <Menu user={user}/>
        </div>
    )
}

export default Groups;