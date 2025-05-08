import React from 'react';
import styles from './answer.module.css';

interface AnswerDisplayProps {
  answer: string;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer }) => {
  if (!answer) return null;

  return (
    <div className={styles.answerBox}>
      <h3 className={styles.title}>Generated Response</h3>
      <p className={styles.response}>{answer}</p>
    </div>
  );
};

export default AnswerDisplay;
