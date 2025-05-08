import React from 'react';
import styles from './answer.module.css';

interface AnswerDisplayProps {
  answer: string;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer }) => {
  return (
    <div className={styles.inputBox}>
      <h3 className={styles.title}>Generated Response</h3>
      <p className={styles.response}>{answer ? answer : 'Your answer will appear here.'}</p>
    </div>
  );
};

export default AnswerDisplay;
