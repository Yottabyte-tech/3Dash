// App.js
import React, { useState, useEffect } from 'react';
import { countRef, updateDoc, increment, onSnapshot } from './firebase'; // Import onSnapshot

function App() {
  const [count, setCount] = useState(0); // Default to 0
  const [loading, setLoading] = useState(true); // Handle loading state

  // Function to increment the count in Firestore
  const incrementCount = async () => {
    try {
      await updateDoc(countRef, {
        count: increment(1), // Increment the count by 1
      });
    } catch (error) {
      console.error("Error incrementing count: ", error);
    }
  };

  // Fetch count initially and set up real-time updates
  useEffect(() => {
    // Listen to Firestore updates in real-time
    const unsubscribe = onSnapshot(countRef, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().count);
        setLoading(false);
      } else {
        console.log("No such document!");
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
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
