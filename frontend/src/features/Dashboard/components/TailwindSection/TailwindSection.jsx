import React from 'react';
import styles from './TailwindSection.module.css';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { SiTailwindcss } from 'react-icons/si';
import LibraryStatusIndicator from '../LibraryStatusIndicator';
import { useTailwindSectionLogic } from './TailwindSection';

const TailwindSection = ({ libraryStatus }) => {
  const { isExpanded, toggleExpand } = useTailwindSectionLogic();

  return (
    // Restore Tailwind classes from original Dashboard.js
    <section className={`bg-gray-800 rounded-xl ${styles.tailwindSection}`}>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleExpand}> {/* Add cursor-pointer */}
        <div className="flex items-center space-x-3">
          <SiTailwindcss className="h-8 w-8 text-teal-400" />
          <h2 className="text-xl font-bold">Tailwind CSS</h2>
        </div>
        <button 
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isExpanded && (
        <div className="p-4">
          <LibraryStatusIndicator libraryName='Tailwind' status={libraryStatus} />
        </div>
      )}
    </section>
  );
};

export default TailwindSection;

