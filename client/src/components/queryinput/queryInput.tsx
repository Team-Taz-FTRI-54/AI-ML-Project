import React from 'react';
import styles from './queryInput.module.css';
import logo from '../../assets/logo-qs-tp.png';

interface QueryInputProps {
  onQuickPrompt?: (prompt: string) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ onQuickPrompt }) => {
  return (
    <>
      <div className={styles.headingsWrapper}>
        <h1 className={styles.Title}>Ask Your PDF</h1>
        <img className={styles.logo} src={logo} alt="ask-your-pdf-logo" />
      </div>

      <div className={styles.btns}>
        <button onClick={() => onQuickPrompt?.('What if...')}>What if...</button>
        <button onClick={() => onQuickPrompt?.('Tell me more')}>Tell me more</button>
        <button onClick={() => onQuickPrompt?.('To Be Determined')}>Tell me more</button>
      </div>

      <div className={styles.textBoxContainer}>
        <input className={styles.textBox} placeholder="Please type your prompt here"></input>
      </div>
    </>
  );
};
export default QueryInput;
