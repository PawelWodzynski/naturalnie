import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './StatusChart.module.css';
import { useStatusChartLogic } from './StatusChart';

const StatusChart = ({ data }) => {
  const { chartData } = useStatusChartLogic(data);

  if (!chartData || chartData.length === 0) {
    // Use Tailwind for 'no data' message
    return <div className={`text-center text-gray-500 py-4 ${styles.noDataMessage}`}>No chart data available</div>;
  }

  return (
    // Use Tailwind for chart container height (adjust as needed, h-64 is an example)
    <div className={`h-64 w-full ${styles.chartWrapper}`}> 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {/* Use Tailwind colors for chart elements */}
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" /> {/* gray-600 */}
          <XAxis dataKey="name" stroke="#9ca3af" /> {/* gray-400 */}
          <YAxis stroke="#9ca3af" /> {/* gray-400 */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} /* gray-800, gray-700 */
            itemStyle={{ color: '#d1d5db' }} /* gray-300 */
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }}/> {/* gray-300 */}
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;

