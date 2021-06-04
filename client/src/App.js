import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { io } from "socket.io-client";

function App() {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState('');
  const socket = io("http://localhost:3001");
  socket.connect();

  socket.on("comment", (data) => {
    setAllComments([...allComments, data]);
    setUserId(data.userId);
  });

  const fieldName = (value) => {
    setName(value);
  };

  const fieldEmail = (value) => {
    setEmail(value);
  };

  const fieldMessage = (e) => {
    setComment(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/', {
      userId,
      name,
      email,
      comment
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setComment('');
      })
  };

  return (
    <div className="App">
      <h1>Tchat</h1>
      {allComments.map(comment => (
        <div key={comment.userId}>
          <p>{comment.name}</p>
          <p>{comment.email}</p>
          <p>{comment.comment}</p>
        </div>
      ))}
      <input type="text" name="name" onChange={(event) => fieldName(event.target.value)} value={name} />
      <input type="email" name="email" onChange={(event) => fieldEmail(event.target.value)} value={email} />
      <textarea
        onChange={(event) => fieldMessage(event)}
        value={comment}
      />
      <button onClick={(event) => sendMessage(event)}>Envoyer</button>
    </div>
  );
}

export default App;
