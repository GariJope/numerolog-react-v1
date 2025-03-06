import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: birthdate });
      await setDoc(doc(db, 'users', user.uid), { birthdate });
      alert('Зарегистрирован! Теперь войдите.');
      window.location.href = '/login';
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleRegister}>
        <label>Почта:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
        <label>Пароль:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <label>Дата рождения (ДД.ММ.ГГГГ):</label>
        <input type="text" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} placeholder="15.08.1990" required /><br />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Вход</Link></p>
    </div>
  );
}

export default Register;
