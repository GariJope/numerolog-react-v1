import React, { useState, useEffect, useRef } from 'react'; // Добавили useRef
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Daily.css';

function Daily() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [forecast, setForecast] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Переменная для отслеживания первого запроса

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          // Выполняем запрос только если ещё не делали
          if (!hasFetched.current) {
            fetchDailyForecast(userDoc.data());
            hasFetched.current = true; // Отмечаем, что запрос выполнен
          }
        } else {
          navigate('/profile');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchDailyForecast = async (data) => {
    setLoading(true);
    const currentDate = new Date().toLocaleDateString('ru-RU');

    const prompt = `
      Ты — профессиональный нумеролог. На основе даты рождения (${data.birthDate}) 
      и текущей даты (${currentDate}) составь персонализированный прогноз на день для 
      ${data.firstName} ${data.lastName} ${data.middleName || ''}. 
      Учти нумерологические принципы. Прогноз должен быть кратким (2-3 предложения).
    `;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Ты — нумеролог, дающий точные прогнозы.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const forecastText = response.data.choices[0].message.content.trim();
      setForecast(forecastText);
    } catch (error) {
      console.error('Детали ошибки:', error.response ? error.response.data : error.message);
      setForecast(`Ошибка: ${error.message}. Код: ${error.response?.status || 'Неизвестен'}.`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="daily-container">
      <h1>Ежедневные рекомендации</h1>
      <p>Привет, {userData.firstName} {userData.lastName}!</p>
      <div className="recommendation">
        <p>Прогноз на день:</p>
        {loading ? (
          <p>Загрузка прогноза...</p>
        ) : (
          <p>{forecast || 'Ваши персональные рекомендации будут здесь.'}</p>
        )}
      </div>
      <button onClick={() => auth.signOut()}>Выйти</button>
    </div>
  );
}

export default Daily;