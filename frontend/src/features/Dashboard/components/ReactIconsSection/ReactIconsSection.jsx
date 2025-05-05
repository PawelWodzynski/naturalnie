import React from 'react';
import styles from './ReactIconsSection.module.css';
import { FaReact, FaNodeJs, FaGithub, FaDocker, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import LibraryStatusIndicator from '../LibraryStatusIndicator';
import { useReactIconsSectionLogic } from './ReactIconsSection';

const ReactIconsSection = ({ libraryStatus }) => {
  const { isExpanded, toggleExpand } = useReactIconsSectionLogic();

  return (
    // Restore Tailwind classes from original Dashboard.js
    <section className={`bg-gray-800 rounded-xl ${styles.reactIconsSection}`}>
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleExpand}> {/* Add cursor-pointer */}
        <div className="flex items-center space-x-3">
          <FaReact className="h-8 w-8 text-blue-400" />
          <h2 className="text-xl font-bold">React Icons</h2>
        </div>
        <button 
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isExpanded && (
        // Restore Tailwind classes for content area, including grid layout
        <div className="p-4 grid grid-cols-4 gap-4 items-center"> {/* Added items-center for vertical alignment */}
          {/* Span the status indicator across columns or place appropriately */}
          <div className="col-span-4 mb-4"> {/* Span status indicator */}
             <LibraryStatusIndicator libraryName='React Icons' status={libraryStatus} />
          </div>
          {libraryStatus && (
            <>
              {/* Apply Tailwind classes for icon styling */}
              <FaReact className="h-12 w-12 text-blue-500 justify-self-center" />
              <FaNodeJs className="h-12 w-12 text-green-500 justify-self-center" />
              <FaGithub className="h-12 w-12 text-gray-500 justify-self-center" />
              <FaDocker className="h-12 w-12 text-blue-500 justify-self-center" />
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default ReactIconsSection;

