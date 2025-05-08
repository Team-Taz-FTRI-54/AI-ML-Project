import { useState } from 'react';
import AnswerDisplay from '../answerDisplay/answerDisplay';
import QueryInput from '../queryinput/queryInput';
import Flash from '../flashPage/flash';
import styles from './querywrapper.module.css';

export default function QueryWrapper() {
  const [answer, setAnswer] = useState('');

  return (
    <div className={styles.mainContainer}>
      <Flash />
      <div className={styles.contentRow}>
        <QueryInput setAnswer={setAnswer} />
        <AnswerDisplay answer={answer} />
      </div>
    </div>
  );
}
