import React from 'react';
import styles from './ApiAuthorizationSection.module.css';
import { FaKey, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import ApiTestButton from './components/ApiTestButton';
import ApiStatusDisplay from './components/ApiStatusDisplay';
import TokenDisplay from './components/TokenDisplay';
import DataTable from './components/DataTable';
import { useApiAuthorizationSectionLogic } from './ApiAuthorizationSection';

const ApiAuthorizationSection = ({ apiAuthStatus, onTestApi }) => {
  const { isExpanded, toggleExpand } = useApiAuthorizationSectionLogic();

  return (
    // Restore Tailwind classes from original Dashboard.js
    <section className={`bg-gray-800 rounded-xl ${styles.apiAuthSection}`}>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleExpand}> {/* Add cursor-pointer */}
        <div className="flex items-center space-x-3">
          <FaKey className="h-8 w-8 text-indigo-400" /> {/* Adjusted color based on original */} 
          <h2 className="text-xl font-bold">Api Authorization</h2>
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
          {/* Restore Tailwind classes for description */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300">Test autoryzacji API z wykorzystaniem tokena z localStorage</p>
            <p className="text-sm text-gray-400 mt-1">
              Endpoint: <code className="bg-gray-600 px-1 rounded">/example/test</code> z tokenem jako parametrem zapytania
            </p>
          </div>
          
          <ApiTestButton 
            onClick={onTestApi} 
            isLoading={apiAuthStatus.loading} 
          />
          
          <ApiStatusDisplay status={apiAuthStatus} />
          
          <TokenDisplay />
          
          {/* Render DataTable only if API call was successful and returned data */}
          {apiAuthStatus.success && apiAuthStatus.data && (
            <DataTable data={apiAuthStatus.data} />
          )}
        </div>
      )}
    </section>
  );
};

export default ApiAuthorizationSection;

