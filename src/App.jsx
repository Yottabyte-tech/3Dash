// App.js
import React, { useState, useEffect } from 'react';
import db from './firebase'; // import the firebase configuration
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [users, setUsers] = useState([]);

  const usersCollectionRef = collection(db, "users");

  // Add user to Firestore
  const addUser = async () => {
    try {
      await addDoc(usersCollectionRef, {
        name: name,
        age: age,
      });
      setName('');
      setAge('');
      fetchUsers(); // Refresh user list after adding
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Firestore with React</h1>

      {/* Add User Form */}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      {/* Display Users */}
      <div>
        <h2>Users:</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name} - {user.age} years old
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
