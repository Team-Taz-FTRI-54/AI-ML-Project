import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContext/useUser';
import styles from './login.module.css';

export default function Login() {
  const [action, setAction] = useState('Login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //* Get global context setter
  const { setUsername: setGlobalUsername } = useUser();
  //* used to redirect
  const navigate = useNavigate();

  //* Sync local username to global context
  useEffect(() => {
    setGlobalUsername(username);
  }, [username, setGlobalUsername]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      navigate('/history');
    } catch (err) {
      console.error(`Error in ${action}`, err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.welcome}>{action} for Access</h1>

      <form onSubmit={handleSubmit}>
        <input
          className={styles.userName}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // now updates local state
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
