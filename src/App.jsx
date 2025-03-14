// App.js
import React, { useState, useEffect } from 'react';
import { countRef, updateDoc, getDoc, increment, onSnapshot } from './firebase'; // Import onSnapshot

function App() {
  const [count, setCount] = useState(0); // Default to 0
  const [loading, setLoading] = useState(true); // Handle loading state

  // Function to increment the count in Firestore
  const incrementCount = async () => {
    try {
      // Increment the count in Firestore directly
      await updateDoc(countRef, {
        count: increment(1), // Increment by 1
      });
    } catch (error) {
      console.error("Error incrementing count: ", error);
    }
  };

  // Fetch count initially and set up real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(countRef, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().count); // Update state with real-time count
        setLoading(false);
      } else {
        console.log("No such document!");
      }
    });

    // Cleanup listener when the component unmounts
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
