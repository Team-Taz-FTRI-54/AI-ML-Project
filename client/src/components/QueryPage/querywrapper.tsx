import { useState } from 'react';
import AnswerDisplay from '../answerDisplay/answerDisplay';
import QueryInput from '../queryinput/queryInput';
import Flash from '../flashPage/flash';

export default function QueryWrapper() {
  const [answer, setAnswer] = useState('');

  return (
    <div>
      <Flash />
      <QueryInput setAnswer={setAnswer} />
      <AnswerDisplay answer={answer} />
    </div>
  );
}
