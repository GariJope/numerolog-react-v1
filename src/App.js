import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Daily from './components/Daily';
import Profile from './components/Profile';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Исправленный импорт
import { db } from './firebase';
import './App.css';

function App() {
  const [userProfileComplete, setUserProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (userDoc) => {
          setUserProfileComplete(userDoc.exists() && !!userDoc.data().birthDate);
        }, (error) => {
          console.error('Ошибка при отслеживании профиля:', error);
          setUserProfileComplete(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setUserProfileComplete(false);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/daily"
            element={userProfileComplete ? <Daily /> : <Navigate to="/profile" />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;