import React, { useState } from 'react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { collection, addDoc, getDocs } from '@firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [gameSchedule, setGameSchedule] = useState([]);

  // User Authentication
  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      fetchData();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  // Fetch Data from Firestore
  const fetchData = async () => {
    const plansSnapshot = await getDocs(collection(db, 'training_plans'));
    setTrainingPlans(plansSnapshot.docs.map(doc => doc.data()));

    const gamesSnapshot = await getDocs(collection(db, 'game_schedule'));
    setGameSchedule(gamesSnapshot.docs.map(doc => doc.data()));
  };

  return (
    <div className="app-container">
      <header>
        <h1>Golden State Warriors Internal System</h1>
        {user ? (
          <button onClick={() => signOut(auth)}>Logout</button>
        ) : (
          <div className="login-form">
            <button onClick={() => handleLogin('staff@warriors.com', 'password')}>
              Staff Login
            </button>
            <button onClick={() => handleLogin('admin@warriors.com', 'password')}>
              Admin Login
            </button>
          </div>
        )}
      </header>

      {user && (
        <main>
          {/* Training Plans Section */}
          <section className="training-plans">
            <h2>Training Plans</h2>
            <ul>
              {trainingPlans.map((plan, index) => (
                <li key={index}>
                  <h3>{plan.title}</h3>
                  <p>{plan.description}</p>
                  <small>{plan.date}</small>
                </li>
              ))}
            </ul>
          </section>

          {/* Game Schedule Section */}
          <section className="game-schedule">
            <h2>Game Schedule</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {gameSchedule.map((game, index) => (
                  <tr key={index}>
                    <td>{game.date}</td>
                    <td>{game.opponent}</td>
                    <td>{game.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;