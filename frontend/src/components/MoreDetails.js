import React from 'react';

const MoreDetails = ({ type, data }) => {
  console.log(data);

  // Analyze Allocation Data
  const analyzeAllocation = () => {
    if (!data || data.length === 0) return 'No allocation data available.';
    
    const highestAllocation = data.reduce((max, item) => (item.percentage > max.percentage ? item : max), data[0]);
    const lowestAllocation = data.reduce((min, item) => (item.percentage < min.percentage ? item : min), data[0]);
    const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);
    
    return (
      <div>
        <h3>Portfolio Allocation Insights</h3>
        <p>Total Allocation: {totalPercentage.toFixed(2)}%</p>
        <p>Highest Allocation: {highestAllocation.name} ({highestAllocation.percentage.toFixed(2)}%)</p>
        <p>Lowest Allocation: {lowestAllocation.name} ({lowestAllocation.percentage.toFixed(2)}%)</p>
      </div>
    );
  };

  // Analyze Performance Data
  const analyzePerformance = () => {
    if (!data || data.length === 0) return 'No performance data available.';
    
    const avgROI = data.reduce((sum, entry) => sum + entry.roi, 0) / data.length;
    const highestROI = data.reduce((max, entry) => (entry.roi > max.roi ? entry : max), data[0]);
    const lowestROI = data.reduce((min, entry) => (entry.roi < min.roi ? entry : min), data[0]);
    
    return (
      <div>
        <h3>Performance Summary</h3>
        <p>Average ROI: {avgROI.toFixed(2)}%</p>
        <p>Best Performance Day: {highestROI.date} (ROI: {highestROI.roi}%)</p>
        <p>Worst Performance Day: {lowestROI.date} (ROI: {lowestROI.roi}%)</p>
      </div>
    );
  };

  // Analyze Key Metrics Data
  const analyzeKeyMetrics = () => {
    if (!data) return 'No key metrics data available.';
    
    return (
      <div>
        <h3>Key Metrics Overview</h3>
        <p><strong>Total Value:</strong> ${data.totalValue}</p>
        <p><strong>Daily P&L:</strong> ${data.dailyPnL}</p>
        <p><strong>Win Rate:</strong> {data.winRate}%</p>
        <p><strong>CAGR:</strong> {data.cagr}%</p>
        <p><strong>Max Drawdown:</strong> {data.drawdown}%</p>
      </div>
    );
  };

  if (type === 'allocation') {
    return analyzeAllocation();
  } else if (type === 'performance') {
    return analyzePerformance();
  } else if (type === 'keyMetrics') {
    return analyzeKeyMetrics();
  }

  return <div>No details available for this type.</div>;
};

export default MoreDetails;