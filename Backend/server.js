const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment');

// Mongoose Schemas 
const StrategySchema = new mongoose.Schema({
  name: String,
  allocation: Number,
  performance: Number,
  roi: Number,
  risk: String
});

const PerformanceSchema = new mongoose.Schema({
  date: Date,
  value: Number,
  roi: Number
});

const AllocationSchema = new mongoose.Schema({
  name: String,
  value: Number,
  percentage: Number
});

const TradeSchema = new mongoose.Schema({
  asset: String,
  type: String,
  quantity: Number,
  price: Number,
  date: Date
});

const MarketUpdateSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  impact: String
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
const MarketUpdate = mongoose.model('MarketUpdate', MarketUpdateSchema);
const Strategy = mongoose.model('Strategy', StrategySchema);
const Performance = mongoose.model('Performance', PerformanceSchema);
const Allocation = mongoose.model('Allocation', AllocationSchema);
const Trade = mongoose.model('Trade', TradeSchema);

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, 
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/moneyai_portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Registration
app.post("/api/register", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    const user = new User({ name, email, password, phoneNumber });
    await user.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    console.log(user);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Portfolio Data 
app.get('/api/portfolio-data', async (req, res) => {
  try {
    const strategies = await Strategy.find();
    const performance = await Performance.find().sort({date: 1});
    const allocation = await Allocation.find();
    const recentTrades = await Trade.find().sort({date: -1}).limit(5);

    // Calculate Key Metrics
    const calculateKeyMetrics = (strategies, performance) => {
      const latestPerformance = performance[performance.length - 1];
      const previousPerformance = performance[performance.length - 2];

      // Calculate CAGR
      const startValue = performance[0].value;
      const endValue = latestPerformance.value;
      const years = moment(latestPerformance.date).diff(moment(performance[0].date), 'years', true);
      const cagr = Math.pow(endValue / startValue, 1 / years) - 1;

      return {
        totalValue: strategies.reduce((sum, strategy) => sum + (strategy.allocation || 0), 0),
        dailyPnL: latestPerformance.value - previousPerformance.value,
        winRate: strategies.filter(s => s.performance > 0).length / strategies.length * 100,
        cagr: (cagr * 100).toFixed(2),
        drawdown: calculateMaxDrawdown(performance)
      };
    };

    // Max Drawdown Calculation
    const calculateMaxDrawdown = (performanceData) => {
      let maxDrawdown = 0;
      let peak = performanceData[0].value;

      performanceData.forEach(data => {
        if (data.value > peak) {
          peak = data.value;
        }
        const drawdown = (peak - data.value) / peak * 100;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      });

      return maxDrawdown.toFixed(2);
    };
    const keyMetrics = calculateKeyMetrics(strategies, performance);

    res.json({
      performance: performance.map(p => ({
        date: moment(p.date).format('YYYY-MM-DD'),
        value: p.value,
        roi: p.roi
      })),
      allocation,
      strategies,
      keyMetrics,
      recentTrades
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint for Performance Filter
app.get('/api/performance-filter', async (req, res) => {
  try {
    const { startDate, endDate} = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    const filteredPerformance = await Performance.find(query).sort({date: 1});
    res.json(filteredPerformance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint for Market Updates
app.get('/api/market-updates', async (req, res) => {
  try {
    const marketUpdates = await MarketUpdate.find().sort({date: -1}).limit(10);
    res.json(marketUpdates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});