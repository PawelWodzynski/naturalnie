import React from 'react';
import styles from './AxiosSection.module.css';
import { SiAxios } from 'react-icons/si';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import LibraryStatusIndicator from '../LibraryStatusIndicator';
import { useAxiosSectionLogic } from './AxiosSection';

const AxiosSection = ({ libraryStatus }) => {
  const { isExpanded, toggleExpand } = useAxiosSectionLogic();

  return (
    // Restore Tailwind classes from original Dashboard.js
    <section className={`bg-gray-800 rounded-xl ${styles.axiosSection}`}>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleExpand}> {/* Add cursor-pointer */}
        <div className="flex items-center space-x-3">
          <SiAxios className="h-8 w-8 text-yellow-400" />
          <h2 className="text-xl font-bold">Axios</h2>
        </div>
        <button 
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isExpanded && (
        // Restore Tailwind classes for content area
        <div className="p-4 space-y-4">
          <LibraryStatusIndicator libraryName='Axios' status={libraryStatus} />
          {/* No additional content needed for Axios section based on original code */}
        </div>
      )}
    </section>
  );
};

export default AxiosSection;

