const mongoose = require('mongoose');
const moment = require('moment');
const { faker } = require('@faker-js/faker');

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/moneyai_portfolio');

// Mongoose Schemas
const StrategySchema = new mongoose.Schema({
  name: String,
  allocation: Number,
  performance: Number,
  roi: Number,
  risk: String,
  sharpeRatio: Number,
  drawdown: Number,
  alpha: Number,
  beta: Number,
});

const PerformanceSchema = new mongoose.Schema({
  date: Date,
  value: Number,
  roi: Number,
});

const AllocationSchema = new mongoose.Schema({
  name: String,
  value: Number,
  percentage: Number,
});

const TradeSchema = new mongoose.Schema({
  asset: String,
  type: String,
  quantity: Number,
  price: Number,
  date: Date,
  totalValue: Number,
});

const MarketUpdateSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  impact: String,
});

const KeyMetricsSchema = new mongoose.Schema({
  totalValue: Number,
  dailyPnL: Number,
  winRate: Number,
  cagr: Number,
  drawdown: Number,
});

const Strategy = mongoose.model('Strategy', StrategySchema);
const Performance = mongoose.model('Performance', PerformanceSchema);
const Allocation = mongoose.model('Allocation', AllocationSchema);
const Trade = mongoose.model('Trade', TradeSchema);
const MarketUpdate = mongoose.model('MarketUpdate', MarketUpdateSchema);
const KeyMetrics = mongoose.model('KeyMetrics', KeyMetricsSchema);

// Seed Data Function
async function seedDatabase() {
  try {
    // Clearing existing data
    await Strategy.deleteMany({});
    await Performance.deleteMany({});
    await Allocation.deleteMany({});
    await Trade.deleteMany({});
    await MarketUpdate.deleteMany({});
    await KeyMetrics.deleteMany({});

    // Strategies
    const strategies = Array.from({ length: 5 }, () => ({
      name: faker.company.name(),
      allocation: faker.number.int({ min: 50000, max: 500000 }),
      performance: faker.number.float({ min: -10, max: 20, precision: 0.01 }),
      roi: faker.number.float({ min: -10, max: 20, precision: 0.01 }),
      risk: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
      sharpeRatio: faker.number.float({ min: 0, max: 2, precision: 0.01 }),
      drawdown: faker.number.float({ min: -20, max: 0, precision: 0.01 }),
      alpha: faker.number.float({ min: -5, max: 5, precision: 0.01 }),
      beta: faker.number.float({ min: -1, max: 2, precision: 0.01 }),
    }));
    await Strategy.insertMany(strategies);

    // Performance Data
    const startDate = moment().subtract(1, 'year');
    const performanceData = Array.from({ length: 365 }, (_, i) => {
      const date = moment(startDate).add(i, 'days').toDate();
      const value = faker.number.int({ min: 90000, max: 150000 });
      const roi = faker.number.float({ min: -5, max: 5, precision: 0.01 });
      return { date, value, roi };
    });
    await Performance.insertMany(performanceData);

    // Allocations
    const allocation = Array.from({ length: 5 }, () => ({
      name: faker.finance.currencyCode(),
      value: faker.number.int({ min: 10, max: 50 }),
      percentage: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
    }));
    await Allocation.insertMany(allocation);

    // Trades
    const trades = Array.from({ length: 100 }, () => ({
      asset: faker.finance.currencyCode(),
      type: faker.helpers.arrayElement(['Buy', 'Sell']),
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
      date: faker.date.between({ from: startDate.toDate(), to: new Date() }),
      totalValue: faker.number.int({ min: 500, max: 50000 }),
    }));
    await Trade.insertMany(trades);

    // Market Updates
    const marketUpdates = Array.from({ length: 10 }, () => ({
      title: faker.company.catchPhrase(),
      description: faker.lorem.sentences(3),
      date: faker.date.between({ from: startDate.toDate(), to: new Date() }),
      impact: faker.helpers.arrayElement(['Positive', 'Negative', 'Neutral']),
    }));
    await MarketUpdate.insertMany(marketUpdates);

    // Key Metrics
    const keyMetrics = {
      totalValue: faker.number.int({ min: 100000, max: 1000000 }),
      dailyPnL: faker.number.int({ min: -500, max: 500 }),
      winRate: faker.number.float({ min: 50, max: 100, precision: 0.01 }),
      cagr: faker.number.float({ min: 5, max: 20, precision: 0.01 }),
      drawdown: faker.number.float({ min: -20, max: 0, precision: 0.01 }),
    };
    await KeyMetrics.create(keyMetrics);

    console.log('Database seeded successfully with realistic data');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
