import { useEffect, useState } from 'react';
import styles from './queryHistory.module.css';

type LogItem = {
  prompt: string;
  type: string;
  embedding: string;
  pineconeQueryResult: string;
  answer: string;
};

export default function QueryHistory() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/query');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('❌ Error fetching logs:', err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Query History</h1>
      <h2 className={styles.subtitle}>Table of AI Searches</h2>

      <table className={styles.logTable}>
        <thead>
          <tr>
            <th>Prompt</th>
            <th>Type</th>
            <th>Embedding</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.prompt}</td>
              <td>{log.type}</td>
              <td>{log.embedding?.slice(0, 1)}...</td>
              <td>{log.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
