import React from 'react';
import styles from './LibraryStatusIndicator.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const LibraryStatusIndicator = ({ libraryName, status }) => {
  return (
    // Restore Tailwind classes based on original Dashboard.js context
    <div className={`flex items-center space-x-2 ${styles.indicatorContainer}`}>
      {status ? (
        <>
          <FaCheckCircle className="text-green-500" />
          <span className="text-green-400">Biblioteka {libraryName} działa</span>
        </>
      ) : (
        <>
          <FaTimesCircle className="text-red-500" />
          <span className="text-red-400">Biblioteka {libraryName} nie działa</span>
        </>
      )}
    </div>
  );
};

export default LibraryStatusIndicator;

