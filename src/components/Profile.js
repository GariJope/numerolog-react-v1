import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !birthDate) {
      setError('Заполните все обязательные поля!');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          firstName,
          lastName,
          middleName: middleName || '',
          birthDate,
          createdAt: new Date().toISOString(),
        }, { merge: true });
        console.log('Данные сохранены для пользователя:', user.uid);
        console.log('Проверяем перенаправление на /daily...'); // Доп. лог
        navigate('/daily');
      }
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      setError('Ошибка при сохранении: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Заполните профиль</h1>
      {error && <div className="error">{error}</div>}
      <div className="input-group">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Имя *"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Фамилия *"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Отчество (опционально)"
        />
      </div>
      <div className="input-group">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          placeholder="Дата рождения *"
          required
        />
      </div>
      <button type="submit">Сохранить</button>
    </form>
  );
}

export default Profile;