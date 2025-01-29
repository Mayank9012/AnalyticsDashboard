# AnalyticsDashboard

This is a web application designed to provide an in-depth analysis of portfolio performance, including dynamic charts, key metrics, and strategy comparisons. It supports simulated financial data, such as investment performance, portfolio allocation, recent trades, and market updates.

## Features

- **Dynamic Charts**: Visualize portfolio growth, asset allocation, and profit/loss for different strategies.
- **Key Metrics**: View total portfolio value, daily P&L, win rate, CAGR, and max drawdown.
- **Data Filtering & Sorting**: Filter by date range and sort by performance.
- **Simulated Strategy Reports**: Get ROI, CAGR, and drawdown data for various strategies.
- **Recent Trades & Market Updates**: Displays recent trades and market impact updates.
- **Responsive UI**: The dashboard is designed to be mobile-friendly and responsive.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (simulated data)

## Getting Started

Follow the steps below to run the project locally:

### Prerequisites

Make sure you have the following installed:
- Node.js (>= 14.x), current version: `v22.12.0`
- npm (>= 6.x), current version: `9.9.4`
- MongoDB (running locally or use MongoDB Atlas for remote DB)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Mayank9012/AnalyticsDashboard.git
    cd AnalyticsDashboard
    ```

2. Install the backend dependencies:

    ```bash
    cd Backend
    npm install
    ```

3. Install the frontend dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

4. Run the backend server:

    ```bash
    cd ../Backend
    npm run dev
    ```

5. Run the frontend server:

    ```bash
    cd ../frontend
    npm start
    ```

6. Open the browser and navigate to `http://localhost:3000` to see the application.

### Key Points:

- The **MongoDB connection URL** is directly included in the server code (`mongoose.connect()`), and the `README.md` simply suggests replacing it with your own MongoDB instance details (either local or cloud, like MongoDB Atlas).
