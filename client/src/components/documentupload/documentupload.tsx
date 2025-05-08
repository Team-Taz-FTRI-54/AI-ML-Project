import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './documentupload.module.css';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //* gives us access to useNavigate from react-router
  const navigate = useNavigate();

  // Handle file selection via file input and will ensure that we do not allow for any file type that isn't pdf
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      setSelectedFile(event.target.files[0]);
    }
  };

  //* Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setSelectedFile(event.dataTransfer.files[0]);
      }
    }
  };

  //* Handle wrong file upload
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        navigate('./query');
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
    <div className={styles.pageContainer}>
      <div className={styles.inputBox} onDrop={handleDrop} onDragOver={handleDragOver}>
        {!selectedFile && <p>Drag and drop a file here, or click to select</p>}

        <input
          className={styles.inputFile}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          aria-label="Upload a file"
          ref={fileInputRef}
        />

        {selectedFile && (
          <div className={styles.fileInfo}>
            <p>Selected file: {selectedFile.name}</p>
          </div>
        )}

        <div className={styles.buttonGroup}>
          {selectedFile && (
            <button onClick={handleRemoveFile} className={styles.removeButton}>
              Remove
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className={styles.uploadButton}
            title={!selectedFile ? 'Select a PDF file to enable upload' : ''}
            aria-label="Upload the selected PDF file"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default FileUpload;
