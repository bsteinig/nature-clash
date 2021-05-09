import firebase from 'firebase'
import "firebase/auth";
import "firebase/database";
import 'firebase/app'
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBgmqa96k71lM1FIMUqmp9ldbPoY4TDGj0",
    authDomain: "nature-clash.firebaseapp.com",
    projectId: "nature-clash",
    databaseURL: "https://nature-clash-default-rtdb.firebaseio.com/",
    storageBucket: "nature-clash.appspot.com",
    messagingSenderId: "505418345147",
    appId: "1:505418345147:web:94177864bfb3ad428d179e",
    measurementId: "G-T6NKYY5TEE"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()

export const signInWithGoogle = (setUser) => {
  auth.signInWithPopup(googleProvider).then((res) => {
    const { displayName, email, uid, photoURL } = res.user;
    let user = {
      displayName, email, uid, photoURL
    }
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user))
    
    //every user must have an email
    firebase.database().ref(`users/${user.uid}`).once("value", snapshot => {
      if (snapshot.exists()){ // file exists
        console.log("exists!");
        updateToExisting(user)
        return true;
      }
      let data = {
        user: {
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        },
        groups: [user.uid],
        isNew: true,
      }
      createUserData(data)
    });
    
    setUser("logged in");
  }).catch((error) => {
    console.log(error.message)
  })
}

export const getUser = () => {
  auth.onAuthStateChanged(async userData => {
    const { displayName, email, uid, photoURL } = userData;
    let user = {
      displayName, email, uid, photoURL
    }
    return user;
  })
  // if(auth.currentUser){
    
  // }else{
  //   return null;
  // }
}

export const logOut = (setuser) => {
  auth.signOut().then(()=> {
    localStorage.setItem("user", null)
    setuser("not logged in");
  }).catch((error) => {
    console.log(error.message)
  })
}

export const createUserData = (data) => {
    var defaultDatabase = firebase.database();
    let ref = defaultDatabase.ref("/")
    let newTimeline = ref.child(`users/${data.user.uid}`);
    newTimeline.set(data)
    
    ref.child("global/leaderboard").get().then((snapshot) => {
      if (snapshot.exists()) {
        let arr = snapshot.val();
        arr.push({name: data.user.displayName, img: data.user.photoURL, score: 0})
        let newGlobal = ref.child(`global/leaderboard/`)
        newGlobal.set(arr)
      } else {
        let arr = [{name: data.user.displayName, img: data.user.photoURL, score: 0}]
        let newGlobal = ref.child(`global/leaderboard/`)
        newGlobal.set(arr)
      }
    }).catch((error) => {
      console.error(error);
    });
}

export const updateToExisting = (data) => {
    var defaultDatabase = firebase.database();
    let ref = defaultDatabase.ref("/")
    let updateAcc = ref.child(`users/${data.uid}`);
    updateAcc.update({'isNew': false})
}

export const createGroup = (data) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/")
  let newTimeline = ref.child(`groups/${data.groupName}`);
  newTimeline.set(data.sendData) // create Group
  ref.child(`users/${data.uid}/groups`).get().then((snapshot) => {
    let arr = snapshot.val();
    arr.push(data.groupName)
    let newGlobal = ref.child(`users/${data.uid}/groups`)
    newGlobal.set(arr)// add group name to user account
  }).catch((error) => {
    console.error(error);
  });
  ref.child('joinList').get().then((snapshot) => {
    let dt = snapshot.val();
    dt.push(data.groupName)
    let newList = ref.child('joinList')
    newList.set(dt)
  }).catch((error) => {
    console.error(error);
  });
}

export const fetchGroup = (name, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let timelines = ref.child(`groups/${name}`);
  timelines.on('value', (snapshot) => {
    callback(snapshot.val());
  })
}

export const fetchJoinList = (callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let timelines = ref.child(`joinList`);
  timelines.on('value', (snapshot) => {
    callback(snapshot.val());
  })
}

export const joinGroup = (data) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/")
  ref.child(`users/${data.uid}/groups`).get().then((snapshot) => {
    let arr = snapshot.val();
    arr.push(data.groupName)
    let newGlobal = ref.child(`users/${data.uid}/groups`)
    newGlobal.set(arr)// add group name to user account
  }).catch((error) => {
    console.error(error);
  });
  ref.child(`groups/${data.groupName}/leaderboard`).get().then((snapshot) => {
    let arr = snapshot.val();
    arr.push({name: data.name, score: 0})
    let newGlobal = ref.child(`groups/${data.groupName}/leaderboard`)
    newGlobal.set(arr)
  }).catch((error) => {
    console.error(error);
  });
  ref.child(`groups/${data.groupName}/members`).get().then((snapshot) => {
    let arr = snapshot.val();
    arr.push(data.name)
    let newGlobal = ref.child(`groups/${data.groupName}/members`)
    newGlobal.set(arr)
  }).catch((error) => {
    console.error(error);
  });
}

export const getUserData = (user, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let timelines = ref.child(`users/${user.uid}`);
  timelines.on('value', (snapshot) => {
    callback(snapshot.val());
  })
};

export const getUserGroups = (user, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let timelines = ref.child(`users/${user.uid}/groups`);
  timelines.on('value', (snapshot) => {
    callback(snapshot.val());
  })
};

export const fetchGlobalLeaders = (callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let timelines = ref.child(`global/leaderboard`);
  timelines.on('value', (snapshot) => {
    callback(snapshot.val());
  })
}

export const fetchGlobalChallenges = (callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let exportdata = ref.child('global/challenges');
  exportdata.on('value', (snapshot) => {
    callback(snapshot.val());
  })
}

export const removeUserData = (user, timeline) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let timelines = ref.child(`timelines/${user.uid}/${timeline}`);
  timelines.remove()
};