import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './documentupload.module.css';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //* gives us access to useNavigate from react-router
  const navigate = useNavigate();

  // Handle file selection via file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  //* Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  //* Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    //* Clear any previous errors
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully!');
        //* Clears the file after upload
        setSelectedFile(null);
        navigate('./queryinput');
      } else {
        setError('Error uploading file.');
        console.error('Error: File not uploaded');
      }
    } catch (error) {
      setError('Error uploading file.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.inputBox} onDrop={handleDrop} onDragOver={handleDragOver}>
      <p>Drag and drop a file here, or click to select</p>
      <input className={styles.inputFile} type="file" onChange={handleFileChange} aria-label="Upload a file" />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {uploading ? (
        <button disabled>Uploading...</button>
      ) : (
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FileUpload;
