// App.js
import React, { useState, useEffect } from 'react';
import { countRef, updateDoc, getDoc, increment } from './firebase'; // Import Firestore functions

function App() {
  const [count, setCount] = useState(0); // Store the count value
  const [loading, setLoading] = useState(true); // Handle loading state

  // Function to increment count in Firestore
  const incrementCount = async () => {
    try {
      await updateDoc(countRef, {
        count: increment(1), // Increment the count by 1
      });
    } catch (error) {
      console.error("Error incrementing count: ", error);
    }
  };

  // Fetch the initial count and listen for updates in real-time
  const fetchCount = async () => {
    try {
      const docSnap = await getDoc(countRef);
      if (docSnap.exists()) {
        setCount(docSnap.data().count);
        setLoading(false); // Set loading to false once data is fetched
      } else {
        // If the document doesn't exist, initialize it with count 0
        await updateDoc(countRef, {
          count: 0,
        });
        setCount(0);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error getting count: ", error);
    }
  };

  // Use useEffect to fetch the count when the component mounts
  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="App">
      <h1>Global Click Counter</h1>
      <h2>{loading ? 'Loading...' : count}</h2>
      <button onClick={incrementCount}>Click Me</button>
    </div>
  );
}

export default App;
