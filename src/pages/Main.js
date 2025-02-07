import React from 'react';
import styles from '../styles/Main.module.css';

function Test3() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>This is the main page</h1>
      <p className={styles.paragraph}>Welcome</p>
      {/* Future le buttons here */}
      <button className={styles.button}>Click Me</button>
    </div>
  );
}

export default Test3;