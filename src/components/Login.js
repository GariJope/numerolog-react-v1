import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi'; // Иконки для пользователя и пароля

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Сбрасываем ошибку
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Вошёл! Теперь иди за рекомендациями.');
      window.location.href = '/daily';
    } catch (error) {
      setError('Ошибка: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>LOGIN</h1>
      {error && <div className="error">{error}</div>}
      <div className="input-group">
        <FiUser className="icon" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div className="input-group">
        <FiLock className="icon" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <button type="submit">Login</button>
      <p>
        Already have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}

export default Login;