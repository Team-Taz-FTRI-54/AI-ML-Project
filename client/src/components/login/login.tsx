import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContext/userContext';
import styles from './login.module.css';

export default function Login() {
  const [action, setAction] = useState('Login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setGlobalUsername } = useUser(); // Fixed
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Fixed
    e.preventDefault();

    const url = action === 'Login' ? 'http://localhost:3000/login' : 'http://localhost:3000/signup';

    const body = { username, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`${action} failed!`);
      }

      const data = await res.json();
      window.alert('You have successfully logged in');
      console.log(`${action} success!`, data);

      setGlobalUsername(username);
      navigate('/history');
    } catch (err) {
      console.error(`Error in ${action}`, err);
    }
  };

  return (
    <div>
      <h1>Welcome to the Login Page</h1>

      <h1>
        <span className={styles.titleWatch}>
          <img src="./watching.png" alt="watching tag" className={styles.watching} />
        </span>
        Welcome, valued Employee.
        <span className={styles.titleWatch}>
          <img src="./watching.png" alt="watching tag" className={styles.watching} />
        </span>
        <br />
        {action}
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          className={styles.userName}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.password}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.btns} type="submit">
          {action}
        </button>

        <div>
          {action === 'Sign Up' ? (
            <p className={styles.text}>
              Already have an account?{' '}
              <button className={styles.btns} type="button" onClick={() => setAction('Login')}>
                Log In
              </button>
            </p>
          ) : (
            <p className={styles.text}>
              New here?{' '}
              <button className={styles.btns} type="button" onClick={() => setAction('Sign Up')}>
                Sign Up
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
