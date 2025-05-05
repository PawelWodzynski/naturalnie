import React from 'react';
import styles from './RechartsSection.module.css';
import { FaChartLine, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import LibraryStatusIndicator from '../LibraryStatusIndicator';
import StatusChart from './components/StatusChart';
import { useRechartsSectionLogic } from './RechartsSection';

const RechartsSection = ({ libraryStatus, chartData }) => {
  const { isExpanded, toggleExpand } = useRechartsSectionLogic();

  return (
    // Restore Tailwind classes from original Dashboard.js
    <section className={`bg-gray-800 rounded-xl ${styles.rechartsSection}`}>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleExpand}> {/* Add cursor-pointer */}
        <div className="flex items-center space-x-3">
          <FaChartLine className="h-8 w-8 text-green-400" />
          <h2 className="text-xl font-bold">Recharts</h2>
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
          <LibraryStatusIndicator libraryName='Recharts' status={libraryStatus} />
          {libraryStatus && (
            // Keep the StatusChart component, ensure it renders correctly within this div
            <StatusChart data={chartData} /> 
          )}
        </div>
      )}
    </section>
  );
};

export default RechartsSection;

