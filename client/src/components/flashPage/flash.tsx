import React from 'react';
import styles from './flash.module.css';
import logo from '../../assets/logo-qs-tp.png';

export default function Flash() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headingContainer}>
        <h1 className={styles.title}>Ask Your PDF</h1>
        <img className={styles.logo} src={logo} alt="ask-your-pdf-logo" />
        <h3 className={styles.subText}>Interacting with Static Documents</h3>
      </div>
    </div>
  );
}
