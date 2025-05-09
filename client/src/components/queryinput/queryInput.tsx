import React, { useEffect, useState } from 'react';
import styles from './queryInput.module.css';

//* interface used to tell Typescript we will receive object (props) setAnswer required
interface QueryInputProps {
  setAnswer: (answer: string) => void;
}
//*function for UX... Allows the text box to grow as needed
const autoGrow = (event: React.FormEvent<HTMLTextAreaElement>) => {
  const textarea = event.currentTarget;
  textarea.style.height = 'auto'; // reset height
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const QueryInput: React.FC<QueryInputProps> = ({ setAnswer }) => {
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [promptType, setPromptType] = useState<
    'default' | 'whatif' | 'tellme' | 'tbd'
  >('default');

  useEffect(() => {
    const storedSessionId = localStorage.getItem('documentSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  const handleQuickPrompt = (
    prompt: string,
    type: 'whatif' | 'tellme' | 'tbd'
  ) => {
    setPromptText(prompt);
    setPromptType(type);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!promptText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          type: promptType,
          sessionId: sessionId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit prompt');
      }
      const data = await response.json();
      console.log('Response from backend:', data);
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        {/* prettier-ignore */}
        <div className={styles.buttonContainer}>
          <div className={styles.btns}>
            <button onClick={() => handleQuickPrompt('What if...', 'whatif')}>What if...</button>
            <button onClick={() => handleQuickPrompt('Tell me more', 'tellme')}>Tell me more</button>
            <button onClick={() => handleQuickPrompt('To Be Determined', 'tbd')}>To be Determined</button>
          </div>
        </div>

        {/* prettier-ignore */}
        <div className={styles.textBoxContainer}>
        <textarea
          className={styles.textBox}
          placeholder="Please type your prompt here"
          value={promptText}
          onChange={handleChange}
          onInput={autoGrow}
          rows={6}
       />
       </div>

        <button
          className={styles.btn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
};

export default QueryInput;
