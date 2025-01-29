import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './PortfolioDashboard.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-datepicker/dist/react-datepicker.css';
import WelcomePage from './WelcomePage';
import MoreDetails from './MoreDetails';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PortfolioDashboard = ({ user, setUser }) => {
  const [portfolioData, setPortfolioData] = useState({
    performance: [],
    allocation: [],
    strategies: [],
    keyMetrics: {},
    recentTrades: []
  });
  const [marketUpdates, setMarketUpdates] = useState([]);
  const marketUpdatesRef = useRef(null);

  const [filterDates, setFilterDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [comparedStrategies, setComparedStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsType, setDetailsType] = useState('');
  const [detailsData, setDetailsData] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        const [portfolioResponse, marketUpdatesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/portfolio-data'),
          axios.get('http://localhost:5000/api/market-updates')
        ]);

        setPortfolioData(portfolioResponse.data);
        setMarketUpdates(marketUpdatesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);


  const scrollToMarketUpdates = () => {
    marketUpdatesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Filter performance data based on date range
  const handleDateFilter = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/performance-filter', {
        params: filterDates
      });
      setPortfolioData((prev) => ({
        ...prev,
        performance: response.data
      }));
    } catch (error) {
      console.error('Failed to filter performance', error);
    }
  };

  // Show more details for a specific data type
  const handleMoreDetails = (type, data) => {
    setDetailsType(type);
    setDetailsData(data);
    setShowDetails(true); 
  };

  // Go back to the main dashboard view
  const handleBackToDashboard = () => {
    setShowDetails(false);
  };

  // Clear date filters and reset performance data
  const clearFilters = async () => {
    try {
      setFilterDates({ startDate: '', endDate: '' });
      const response = await axios.get('http://localhost:5000/api/portfolio-data');
      setPortfolioData((prev) => ({
        ...prev,
        performance: response.data.performance
      }));
    } catch (error) {
      console.error('Failed to reset filters', error);
    }
  };

  // Toggle strategy comparison
  const toggleStrategyComparison = (strategy) => {
    setComparedStrategies((prev) =>
      prev.includes(strategy)
        ? prev.filter((s) => s !== strategy)
        : [...prev, strategy]
    );
  };

  // Render Strategy Comparison Table
  const renderStrategyComparison = () => {
    if (comparedStrategies.length === 0) return null;

    return (
      <div className="strategy-comparison">
        <h2>Strategy Comparison</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                {comparedStrategies.map((strategy, index) => (
                  <th key={index}>{strategy.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-tooltip-id="tooltip" data-tooltip-content="Return on Investment: Measures profitability compared to cost">ROI</td>
                {comparedStrategies.map((strategy, index) => (
                  <td key={index}>{strategy.roi}%</td>
                ))}
              </tr>
              <tr>
                <td data-tooltip-id="tooltip" data-tooltip-content="Risk: Measures the overall uncertainty or volatility">Risk</td>
                {comparedStrategies.map((strategy, index) => (
                  <td key={index}>{strategy.risk}</td>
                ))}
              </tr>
              <tr>
                <td data-tooltip-id="tooltip" data-tooltip-content="Sharpe Ratio: Risk-adjusted return metric">Sharpe Ratio</td>
                {comparedStrategies.map((strategy, index) => (
                  <td key={index}>{strategy.sharpeRatio || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td data-tooltip-id="tooltip" data-tooltip-content="Maximum Drawdown: Largest peak-to-trough loss">Maximum Drawdown</td>
                {comparedStrategies.map((strategy, index) => (
                  <td key={index}>{strategy.drawdown || 'N/A'}%</td>
                ))}
              </tr>
              <tr>
                <td data-tooltip-id="tooltip" data-tooltip-content="Alpha: Excess return compared to the benchmark">Alpha</td>
                {comparedStrategies.map((strategy, index) => (
                  <td key={index}>{strategy.alpha || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td data-tooltip-id="tooltip" data-tooltip-content="Beta: Measures sensitivity to market movements">Beta</td>
                {comparedStrategies.map((strategy, index) => (
                  <td key={index}>{strategy.beta || 'N/A'}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <ReactTooltip id="tooltip" effect="solid" />
        </div>
      </div>
    );
  };

  // Render Market Updates
  const renderMarketUpdates = () => (
    <div ref={marketUpdatesRef} className="market-updates">
      <h2>Market Updates</h2>
      {marketUpdates.map((update, index) => (
        <div key={index} className="update-card">
          <h3>{update.title}</h3>
          <p>{update.description}</p>
          <span className={`impact-${update.impact.toLowerCase()}`}>
            Impact: {update.impact}
          </span>
        </div>
      ))}
    </div>
  );

  // Render Date Filter Section
  const renderDateFilterSection = () => (
    <div className="date-filter">
      <input
        type="date"
        value={filterDates.startDate}
        onChange={(e) =>
          setFilterDates((prev) => ({
            ...prev,
            startDate: e.target.value
          }))
        }
      />
      <input
        type="date"
        value={filterDates.endDate}
        onChange={(e) =>
          setFilterDates((prev) => ({
            ...prev,
            endDate: e.target.value
          }))
        }
      />
      <button onClick={handleDateFilter}>Apply Filter</button>
      <button onClick={clearFilters} className="clear-filter-button">
        Clear Filters
      </button>
    </div>
  );

  // Render Performance Chart
  const renderPerformanceChart = () => (
    <div className="chart-container">
      <h2>Portfolio Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={portfolioData.performance}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <button className="more-details-btn" onClick={() => handleMoreDetails('performance', portfolioData.performance)}>
        More Details
      </button>
    </div>
  );

  // Render Allocation Chart
  const renderAllocationChart = () => (
    <div className="chart-container">
      <h2>Portfolio Allocation</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={portfolioData.allocation}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {portfolioData.allocation.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(${index * 60}, 70%, 50%)`}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <button className="more-details-btn" onClick={() => handleMoreDetails('allocation', portfolioData.allocation)}>
        More Details
      </button>
      </div>
  );

  // Render Key Metrics Section
  const renderKeyMetrics = () => {
    const { keyMetrics } = portfolioData;
    return (
      <div className="metrics-container">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Total Value</span>
            <span className="metric-value">${keyMetrics.totalValue?.toLocaleString()}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Daily P&L</span>
            <span className="metric-value">${keyMetrics.dailyPnL?.toLocaleString()}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Win Rate</span>
            <span className="metric-value">{keyMetrics.winRate?.toFixed(2)}%</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">CAGR</span>
            <span className="metric-value">{keyMetrics.cagr}%</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Max Drawdown</span>
            <span className="metric-value">{keyMetrics.drawdown}%</span>
          </div>
        </div>
        <button className="more-details-btn" onClick={() => handleMoreDetails('keyMetrics', keyMetrics)}>
          More Details
        </button>
       </div>
    );
  };

  // Render Strategy Table
  const renderStrategyTable = () => (
    <div className="strategy-container">
      <h2>Strategy Performance</h2>
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Strategy</th>
            <th>ROI</th>
            <th>Risk</th>
            <th>Sharpe Ratio</th>
            <th>Compare</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.strategies.map((strategy, index) => (
            <tr key={index}>
              <td>{strategy.name}</td>
              <td>{strategy.roi}%</td>
              <td>{strategy.risk}</td>
              <td>{strategy.sharpeRatio || 'N/A'}</td>
              <td>
                <input
                  type="checkbox"
                  checked={comparedStrategies.includes(strategy)}
                  onChange={() => toggleStrategyComparison(strategy)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );

  // Render Recent Trades Table
  const renderRecentTrades = () => (
    <div className="trades-container">
      <h2>Recent Trades</h2>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.recentTrades.map((trade, index) => (
            <tr key={index}>
              <td>{trade.asset}</td>
              <td>{trade.type}</td>
              <td>{trade.quantity}</td>
              <td>${trade.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Handle Logout
  const handleLogout = async () => {
    try {
      setUser(null);
      return <WelcomePage setUser={setUser} />;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
     
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Welcome, {user?.name || 'User'}!</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h1>Portfolio Analytics Dashboard</h1>

      {/* Market Updates Carousel */}
      <div className="market-updates-carousel">
      <button className="more-updates-button" onClick={() => { console.log('Button clicked'); scrollToMarketUpdates(); }}>
        More Updates
      </button>
        <Slider {...settings}>
          {marketUpdates.slice(0, 3).map((update, index) => (
            <div key={index} className="carousel-slide">
              <h3>{update.title}</h3>
              <p>{update.description}</p>
              <span className={`impact-${update.impact.toLowerCase()}`}>
                Impact: {update.impact}
              </span>
            </div>
          ))}
        </Slider>
      </div>

      {renderDateFilterSection()}
      
      <div className="charts-row">
        {renderPerformanceChart()}
        {renderAllocationChart()}
      </div>

      {renderKeyMetrics()}
      {showDetails && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="back-button" onClick={handleBackToDashboard}>Back</button>
            <MoreDetails type={detailsType} data={detailsData} />
          </div>
        </div>
      )}
      <div className="bottom-row">
        {renderStrategyTable()}
        {renderRecentTrades()}
      </div>

      {renderStrategyComparison()}
      {renderMarketUpdates()}
    </div>
  );
};

export default PortfolioDashboard;