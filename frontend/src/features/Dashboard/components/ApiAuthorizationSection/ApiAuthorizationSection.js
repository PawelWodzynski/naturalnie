import { useState } from 'react';

export const useApiAuthorizationSectionLogic = (initialExpanded = false) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // The actual API call logic (onTestApi) and status (apiAuthStatus)
  // are passed down as props from the main Dashboard component's logic.

  return {
    isExpanded,
    toggleExpand,
  };
};

