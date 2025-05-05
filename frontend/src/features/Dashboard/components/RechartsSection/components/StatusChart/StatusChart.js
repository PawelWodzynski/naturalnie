import { useMemo } from 'react';

// Default data if none is provided
const defaultChartData = [
  { name: 'Sty', uv: 4000, pv: 2400 },
  { name: 'Lut', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Kwi', uv: 2780, pv: 3908 },
  { name: 'Maj', uv: 1890, pv: 4800 },
];

export const useStatusChartLogic = (initialData) => {
  // Use initialData if provided, otherwise use default data
  const chartData = useMemo(() => initialData || defaultChartData, [initialData]);

  // Placeholder for potential future chart-specific logic
  // e.g., data processing, event handlers

  return {
    chartData,
  };
};

