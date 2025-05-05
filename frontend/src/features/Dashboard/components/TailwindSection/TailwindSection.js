import { useState } from 'react';

export const useTailwindSectionLogic = (initialExpanded = false) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return {
    isExpanded,
    toggleExpand,
  };
};

