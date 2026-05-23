/**
 * Canonical Firestore seed data for QauntraBot.
 * Run: npm run seed:data
 */

/** Billing plans — seeded to Firestore `plans/{id}` */
export const SEED_PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    priceTotal: 30,
    pricePerMonth: 30,
    periodLabel: "/ month",
    description:
      "Flexible month-to-month access. Ideal for testing strategies on demo or live before committing longer.",
    savingsNote: null,
    highlighted: false,
    sortOrder: 1,
  },
  {
    id: "semiannual",
    label: "6 months",
    priceTotal: 144,
    pricePerMonth: 24,
    periodLabel: "every 6 months",
    description:
      "Six months of full catalogue access at a lower effective rate. A solid choice for consistent live trading.",
    savingsNote: "Save $36 vs monthly ($180)",
    highlighted: false,
    sortOrder: 2,
  },
  {
    id: "yearly",
    label: "Yearly",
    priceTotal: 240,
    pricePerMonth: 20,
    periodLabel: "/ year",
    description:
      "Lowest cost per month with a full year of access. Best for traders running EAs long term on funded accounts.",
    savingsNote: "Save $120 vs monthly ($360)",
    highlighted: true,
    sortOrder: 3,
  },
];

export const SEED_BOTS = [
  {
    id: "super-ea-grid",
    name: "Super EA Grid",
    subtitle: "XAUUSD Grid System",
    asset: "XAUUSD",
    assetTag: "Gold",
    status: "live",
    risk: "Medium",
    gain: "+247.3%",
    drawdown: "12.4%",
    winRate: "73.2%",
    trades: "847",
    description:
      "Grid-based Gold strategy with dynamic lot sizing. Targets consistent weekly growth on XAUUSD micro and standard accounts.",
    pairs: ["XAUUSD"],
    minDeposit: "$500",
    storageFolder: "super-ea-grid",
    imageKey: "bots/super-ea-grid/cover.png",
    fileKey: "bots/super-ea-grid/ea.ex5",
    proof: {
      backtest: null,
      live: {
        runningSince: "May 2025",
        platform: "MT5",
        broker: "Exness",
        accountType: "Standard",
        imageKeys: [],
        notes: "Live deal history — ~10% weekly target on $10k deposit.",
      },
    },
  },
  {
    id: "forex-scalper",
    name: "Forex Scalper",
    subtitle: "Major Pairs Scalper",
    asset: "EURUSD · GBPUSD",
    assetTag: "Majors",
    status: "beta",
    risk: "Low",
    gain: "+94.1%",
    drawdown: "8.7%",
    winRate: "68.5%",
    trades: "1,342",
    description:
      "High-frequency scalping on major forex pairs during London and New York sessions.",
    pairs: ["EURUSD", "GBPUSD", "USDJPY"],
    minDeposit: "$300",
    storageFolder: "forex-scalper",
    imageKey: "",
    fileKey: "bots/forex-scalper/ea.ex5",
    proof: { backtest: null, live: null },
  },
  {
    id: "multi-asset-portfolio",
    name: "Multi-Asset Portfolio",
    subtitle: "Diversified Basket",
    asset: "Gold · Forex · Indices",
    assetTag: "Portfolio",
    status: "soon",
    risk: "High",
    gain: "—",
    drawdown: "—",
    winRate: "—",
    trades: "—",
    description:
      "Portfolio-level risk controls across correlated and uncorrelated instruments. Coming soon.",
    pairs: ["XAUUSD", "EURUSD", "NAS100"],
    minDeposit: "$1,000",
    storageFolder: "multi-asset-portfolio",
    imageKey: "",
    fileKey: "",
    proof: { backtest: null, live: null },
  },
];

const MONTHS = { monthly: 1, semiannual: 6, yearly: 12 };

function validUntilDays(period) {
  return MONTHS[period] * 30;
}

export const SEED_SUBSCRIPTIONS = [
  {
    email: "",
    billingPeriod: "yearly",
    mtAccountNumber: "",
    licenseKey: "QB-ADMIN-YEAR-0001",
    validUntilDays: validUntilDays("yearly"),
  },
  {
    email: "demo@qauntrabot.com",
    billingPeriod: "monthly",
    mtAccountNumber: "10000992",
    licenseKey: "QB-DEMO-MONTH-7K2M",
    validUntilDays: validUntilDays("monthly"),
  },
  {
    email: "trader@qauntrabot.com",
    billingPeriod: "semiannual",
    mtAccountNumber: "20001845",
    licenseKey: "QB-PRO-6MO-9X4P",
    validUntilDays: validUntilDays("semiannual"),
  },
];

export const SEED_USERS = [
  {
    email: "demo@qauntrabot.com",
    password: "DemoTrader2026!",
    platform: "MT5",
    displayName: "Demo Trader",
  },
  {
    email: "trader@qauntrabot.com",
    password: "ProTrader2026!",
    platform: "MT5",
    displayName: "Pro Trader",
  },
];
