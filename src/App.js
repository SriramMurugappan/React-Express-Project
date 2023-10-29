import './App.css';


import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [data, setUserData] = useState([]);
  const [userid, setUserId] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResult, setShowResult] = useState(false);


  const updateUserId = (event) => {
    setUserId(event.target.value);
  };


  const updateEmail = (event) => {
    setEmail(event.target.value);
  };


  const updatePassword = (event) => {
    setPassword(event.target.value);
  };


  const insertUsers = () => {
    axios.post('http://localhost:9901/insert', { insertid:userid, emailid:email, pass:password})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  function getAll() {
    axios.get('http://localhost:9901/getAll')
        .then((response) => {
            console.log(response.data);
            const userData = response.data;
            userData.forEach(user => {
                user.hidden = user.password;
                user.password = modifyPassword(user.password.length);
            });
            setUserData(userData);
            setShowResult(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }


  function modifyPassword(length) {
    var hide = "";
    for(var i = 0; i <= length; i++) {
        hide += "*";
    }
    return hide;
  }
  
  function clear(){
    setUserId('');
    setPassword('');
    setEmail('');
  }


  const update = (event) => {
    event.preventDefault();
    axios.put('http://localhost:9901/update', { userid:userid, emailid:email, password:password})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  const deleteUser = (event) => {
    event.preventDefault();
    axios.post('http://localhost:9901/delete', { userid:userid})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  return (  
        <div className="App">
            <center><h1>Welcome to React</h1></center>
           
     
            <form >
              <center>
              Enter uid:<input type="text" name="userid" value={userid} onChange={updateUserId}/><br/>
              Enter password:<input type="password" name="password" value={password} onChange={updatePassword}/><br/>
              Enter EmailID:<input type="email" name="emailid" value={email} onChange={updateEmail}/><br/>
              <input type="submit" value="Add" onClick={insertUsers}/>&nbsp;&nbsp;&nbsp;
              <input type='reset' value="reset" onClick={clear}/>&nbsp;&nbsp;&nbsp;
              <input type="button" value="update" onClick={update}/>&nbsp;&nbsp;&nbsp;
              <input type='button' value="delete" onClick={deleteUser}/>&nbsp;&nbsp;&nbsp;
              <input type='button' value="Show All" onClick={getAll}/>&nbsp;&nbsp;&nbsp;
              <br/>
              <br/>
              {/* <input className='button' type='button' value="show" onClick={hello}/> */}
              </center>
            </form>
            {showResult && (
          <div className='result'>
            <table>
              <tr>
                <th>ID</th>
                <th>Password</th>
                <th>Email</th>
              </tr>
             {data.map((item) => (
               <tr><td>{item.userid}</td><td>{item.password}</td><td>{item.emailid}</td></tr>
            ))}
            </table>
        </div>
    )} 

        </div>
      );
            }
     
    export default App;