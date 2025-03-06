import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Добавляем импорт db
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Daily.css';

function Daily() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid); // Теперь db определён
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          navigate('/profile');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user || !userData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="daily-container">
      <h1>Ежедневные рекомендации</h1>
      <p>Привет, {userData.firstName} {userData.lastName}!</p>
      <div className="recommendation">
        <p>Прогноз на день (заглушка):</p>
        <p>Ваши персональные рекомендации будут здесь, когда подключим API.</p>
      </div>
      <button onClick={() => auth.signOut()}>Выйти</button>
    </div>
  );
}

export default Daily;