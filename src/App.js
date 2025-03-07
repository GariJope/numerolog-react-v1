import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Daily from './components/Daily';
import Profile from './components/Profile';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';

function App() {
  const [userProfileComplete, setUserProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App.js: Начало проверки авторизации'); // Отладка
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      console.log('App.js: onAuthStateChanged вызван, пользователь:', user ? user.uid : 'нет'); // Отладка
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (userDoc) => {
          console.log('App.js: onSnapshot вызван, данные:', userDoc.exists() ? userDoc.data() : 'нет данных'); // Отладка
          setUserProfileComplete(userDoc.exists() && !!userDoc.data().birthDate);
          setLoading(false); // Перемещаем сюда
        }, (error) => {
          console.error('App.js: Ошибка в onSnapshot:', error); // Отладка
          setUserProfileComplete(false);
          setLoading(false); // Устанавливаем даже при ошибке
        });
        return () => unsubscribeSnapshot();
      } else {
        console.log('App.js: Пользователь не авторизован'); // Отладка
        setUserProfileComplete(false);
        setLoading(false);
      }
    }, (error) => {
      console.error('App.js: Ошибка в onAuthStateChanged:', error); // Отладка
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